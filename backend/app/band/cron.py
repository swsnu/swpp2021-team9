import pickle
from django.db.models.query import QuerySet
import requests
import json
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import register_events, DjangoJobStore, register_job

from band.models import RecoSong, Cover, Combination

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


def update_view_count():
    def update_view(model):
        model_all = model.objects.all()
        for m in model_all:
            m.view = m.count_views()
        model.objects.bulk_update(model_all, ["view"])

    update_view(Cover)
    update_view(Combination)


def start():
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), "djangojobstore")
    register_events(scheduler)

    @scheduler.scheduled_job("interval", hours=6)
    def auto_test():
        print("auto_test running")
        update_reco_dict()

    @scheduler.scheduled_job("interval", minutes=1)
    def auto_update_view():
        print("auto_update_view running")
        update_view_count()

    try:
        update_reco_dict()
        update_view_count()
        scheduler.start()
    except KeyboardInterrupt:
        scheduler.shutdown()
        print("Scheduler shut down successfully!")
    except Exception:
        print("pass error")
