""" User serializers
DRF serializers for user
"""
from rest_framework import serializers
from .models import CustomUser


class UserSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for user"""

    class Meta:
        model = CustomUser
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "description",
            "photo",
            "followings",
            "instruments",
        ]
