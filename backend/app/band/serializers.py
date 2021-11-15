from .models import (
    Instrument,
    Song,
    Cover,
    Combination,
)
from rest_framework import serializers


class InstrumentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Instrument
        fields = ["name"]


class SongSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Song
        fields = ["title", "singer", "category", "reference", "description"]


class CoverSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Cover
        fields = [
            "audio",
            "title",
            "category",
            "descripton",
            "user",
            "instrument",
            "song",
            "tags",
            "likes",
            "views",
            "combination",
        ]


class CombinationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Combination
        fields = ["view", "song", "covers", "likes"]
