""" Band serializers
DRF serializers for band
"""
from rest_framework import serializers

from user.serializers import UserSerializer
from common.proxy_file_field import ProxyFileField
from .models import (
    CoverTag,
    Instrument,
    Song,
    Cover,
    Combination,
)


class InstrumentSerializer(serializers.ModelSerializer):
    """Serializer for instrument"""

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

    audio = ProxyFileField(allow_empty_file=True)
    user = UserSerializer(many=False, read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    song = SongSerializer(many=False, read_only=True)
    song_id = serializers.IntegerField(write_only=True)
    instrument = InstrumentSerializer(many=False, read_only=True)
    instrument_id = serializers.IntegerField(write_only=True)
    tags = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")
    tags_list = serializers.ListField(write_only=True, required=False)
    # override
    def create(self, validated_data: dict):
        if validated_data.get("tags_list") is not None:
            tags_list = validated_data.pop("tags_list")
            validated_data["tags"] = CoverTag.objects.filter(name__in=tags_list)

        return super().create(validated_data)

    # override
    def update(self, instance, validated_data: dict):
        instance: Cover = super().update(instance, validated_data)
        if validated_data.get("tags_list") is not None:
            tags = CoverTag.objects.filter(name__in=validated_data["tags_list"])
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
            "view",
            # "combination",
            "user_id",
            "song_id",
            "instrument_id",
            "tags_list",
        ]


class CoverLikeSerializer(serializers.ModelSerializer):
    """Serializer for likes of cover"""

    class Meta:
        model = Cover
        fields = [
            "id",
            "likes",
            "like_count",
        ]


class CombinationSerializer(serializers.ModelSerializer):
    """Serializer for combination"""

    song = SongSerializer(many=False, read_only=True)
    song_id = serializers.IntegerField(write_only=True)
    covers = CoverSerializer(many=True, read_only=True)
    covers_list = serializers.ListField(write_only=True, required=True)

    # override
    def create(self, validated_data: dict):
        if validated_data.get("covers_list") is not None:
            covers_list = validated_data.pop("covers_list")
            validated_data["covers"] = Cover.objects.filter(id__in=covers_list)

        return super().create(validated_data)

    class Meta:
        model = Combination
        fields = [
            "id",
            "view",
            "song",
            "covers",
            "likes",
            "like_count",
            "song_id",
            "covers_list",
        ]


class CombinationLikeSerializer(serializers.ModelSerializer):
    """Serializer for likes of combination"""

    class Meta:
        model = Combination
        fields = [
            "id",
            "likes",
            "like_count",
        ]
