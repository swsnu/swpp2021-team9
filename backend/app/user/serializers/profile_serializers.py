""" User serializers
DRF serializers for user
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from user.serializers import UserSerializer
from band.serializers import InstrumentSerializer, CoverSerializer
from common.proxy_file_field import ProxyFileField

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user"""
    instruments = InstrumentSerializer(many=True, read_only=True)
    followings = UserSerializer(many=True, read_only=True)
    followers = UserSerializer(many=True, read_only=True)
    covers = CoverSerializer(many=True, read_only=True)
    photo = ProxyFileField(allow_empty_file=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "description",
            "photo",
            "followings",
            "followers",
            "instruments",
            "covers",
        ]
