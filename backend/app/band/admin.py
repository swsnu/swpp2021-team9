from django.contrib import admin
from .models import (
    Instrument,
    Song,
    Cover,
    Combination,
    CoverTag,
)

# Register your models here.
admin.site.register([Instrument, Song, Cover, Combination, CoverTag])
