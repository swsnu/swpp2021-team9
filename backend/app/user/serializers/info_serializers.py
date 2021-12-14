""" User serializers
DRF serializers for user
"""
from django.contrib.auth import get_user_model
from rest_framework import serializers

from common.proxy_file_field import ProxyFileField

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user"""

    photo = ProxyFileField(allow_empty_file=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "photo",
        ]
