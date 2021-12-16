from django.apps import AppConfig
from django.conf import settings


class BandConfig(AppConfig):
    name = 'band'
    first = True

    def ready(self):
        if self.first and settings.SCHEDULER_DEFAULT:
            print("[cron] start")
            from band import cron
            cron.start()
            self.first = False
