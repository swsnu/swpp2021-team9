import pickle
import requests
import json
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import register_events, DjangoJobStore, register_job

from band.models import RecoSong

recommandation_url = "https://bandreco.s3.ap-northeast-2.amazonaws.com/result.pickle"


def update_reco_dict():
    res = requests.get(recommandation_url)
    recommandation_dict: dict = pickle.loads(res.content)

    new_recos = [
        RecoSong(song_id=song_id, recos=json.dumps(recos))
        for song_id, recos in recommandation_dict.items()
    ]
    RecoSong.objects.all().delete()
    RecoSong.objects.bulk_create(new_recos)
    print("Load success, refresh after 6 hours")


def start():
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), "djangojobstore")
    register_events(scheduler)

    @scheduler.scheduled_job("interval", hours=6)
    def auto_test():
        print("auto_test running")
        update_reco_dict()

    try:
        update_reco_dict()
        scheduler.start()
    except KeyboardInterrupt:
        scheduler.shutdown()
        print("Scheduler shut down successfully!")
    except Exception:
        print("pass error")
