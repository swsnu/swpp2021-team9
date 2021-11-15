""" Band serializers
DRF serializers for band
"""
from rest_framework import serializers
from .models import (
    Instrument,
    Song,
    Cover,
    Combination,
)


class InstrumentSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for insrument"""

    class Meta:
        model = Instrument
        fields = ["id", "name"]


class SongSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for song"""

    class Meta:
        model = Song
        fields = ["id", "title", "singer", "category", "reference", "description"]


class CoverSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for cover"""

    class Meta:
        model = Cover
        fields = [
            "id",
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
    """Serializer for combination"""

    class Meta:
        model = Combination
        fields = ["id", "view", "song", "covers", "likes"]
