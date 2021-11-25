""" Band serializers
DRF serializers for band
"""
from rest_framework import serializers

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

    tags_list = serializers.ListField(write_only=True, required=False)
    song_id = serializers.IntegerField(write_only=True)

    # override
    def create(self, validated_data):
        if validated_data.get("tags_list") is not None:
            tags_list = validated_data.pop("tags_list")
            validated_data["tags"] = CoverTag.objects.filter(name__in=tags_list)

        song_id = validated_data.pop("song_id")
        validated_data["song"] = Song.objects.get(id=song_id)

        print(validated_data)
        return super().create(validated_data)

    # override
    def update(self, instance, validated_data):
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
            "views",
            "combination",
            "tags_list",
            "song_id",
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

    class Meta:
        model = Combination
        fields = ["id", "view", "song", "covers", "likes"]
