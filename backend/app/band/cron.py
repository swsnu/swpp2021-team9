""" Update with cron
update_reco_dict: get recommendation dict from s3 every 6 hours
update_view_count: update view count of Cover and Combination every 30 minutes
"""
import pickle
import json
import requests
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import register_events, DjangoJobStore

from band.models import RecoSong, Cover, Combination

RECOMMENDATION_URL = "https://bandreco.s3.ap-northeast-2.amazonaws.com/result.pickle"


def update_reco_dict():
    print("start update_reco_dict")
    res = requests.get(RECOMMENDATION_URL)
    recommandation_dict: dict = pickle.loads(res.content)
    print(recommandation_dict)

    new_recos = [
        RecoSong(song_id=song_id, recos=json.dumps(recos))
        for song_id, recos in recommandation_dict.items()
    ]
    RecoSong.objects.all().delete()
    RecoSong.objects.bulk_create(new_recos)
    print("Load success, refresh after 6 hours")


def update_view_count():
    print("start update_view_count")

    def update_view(model):
        model_all = model.objects.all()
        for item in model_all:
            item.view = item.count_views()
        model.objects.bulk_update(model_all, ["view"])

    update_view(Cover)
    update_view(Combination)


def start():
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), "djangojobstore")
    register_events(scheduler)

    @scheduler.scheduled_job("interval", hours=6)
    def _auto_update_reco_dict():
        print("auto_update_reco_dict running")
        update_reco_dict()

    @scheduler.scheduled_job("interval", minutes=30)
    def _auto_update_view_count():
        print("auto_update_view_count running")
        update_view_count()

    try:
        update_reco_dict()
        update_view_count()
        scheduler.start()
    except KeyboardInterrupt:
        scheduler.shutdown()
        print("Scheduler shut down successfully!")
    except Exception as error:
        print("pass error", error)
