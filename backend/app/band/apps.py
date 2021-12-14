from django.apps import AppConfig
from django.conf import settings


class BandConfig(AppConfig):
    name = 'band'

    def ready(self):
        if settings.SCHEDULER_DEFAULT:
            from band import cron
            cron.start()
