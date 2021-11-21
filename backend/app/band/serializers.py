""" Band serializers
DRF serializers for band
"""
from django.utils.translation import override
from rest_framework import serializers, validators

from user.serializers import UserSerializer
from .models import (
    CoverTag,
    Instrument,
    Song,
    Cover,
    Combination,
)


class InstrumentSerializer(serializers.ModelSerializer):
    """Serializer for insrument"""

    class Meta:
        model = Instrument
        fields = ["id", "name"]


class SongSerializer(serializers.ModelSerializer):
    """Serializer for song"""

    class Meta:
        model = Song
        fields = ["id", "title", "singer", "category", "reference", "description"]


class CoverSerializer(serializers.ModelSerializer):
    """Serializer for cover"""

    user = UserSerializer(many=False, read_only=True)
    song = SongSerializer(many=False, read_only=True)
    tags = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")

    tags_list = serializers.ListField(write_only=True)

    # override
    # def create(self, validated_data):
    #     print('create')
    #     super().create(validated_data)

    # override
    def update(self, instance, validated_data):
        instance: Cover = super().update(instance, validated_data)
        if validated_data.get('tags_list') is not None:
            tags = CoverTag.objects.filter(name__in=validated_data['tags_list'])
            instance.tags.set(tags)
            instance.save()
        return instance

    class Meta:
        model = Cover
        fields = [
            "id",
            "audio",
            "title",
            "category",
            "description",
            "user",
            "instrument",
            "song",
            "tags",
            "like_count",
            "views",
            "combination",
            "tags_list",
        ]


class CombinationSerializer(serializers.ModelSerializer):
    """Serializer for combination"""

    class Meta:
        model = Combination
        fields = ["id", "view", "song", "covers", "likes"]
