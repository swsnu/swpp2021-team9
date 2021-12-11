""" ProxyFileField
For production add url in file
"""
from django.conf import settings
from rest_framework import serializers
from rest_framework.settings import api_settings


class ProxyFileField(serializers.FileField):
    """
    For production add url in file
    """

    def to_representation(self, value):
        if settings.DEBUG:
            return super().to_representation(value)
        if not value:
            return None

        use_url = getattr(self, "use_url", api_settings.UPLOADED_FILES_USE_URL)
        if use_url:
            try:
                url = value.url
            except AttributeError:
                return None
            return f"https://www.metaband.space{url}"

        return value.name
