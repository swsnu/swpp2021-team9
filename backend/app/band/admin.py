from django.contrib import admin
from .models import Instrument, Song, Cover, Combination, CoverTag, CoverLog, CombinationLog

# Register your models here.
admin.site.register(Instrument)
admin.site.register(Song)
admin.site.register(Cover)
admin.site.register(Combination)
admin.site.register(CoverTag)
