""" User serializers
DRF serializers for user
"""
from rest_framework import serializers
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user"""

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
