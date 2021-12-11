""" User serializers
DRF serializers for user
"""
from rest_framework import serializers
from common.proxy_file_field import ProxyFileField
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user"""
    photo = ProxyFileField(allow_empty_file=True)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "email",
            "description",
            "photo",
            "followings",
            "instruments",
        ]
