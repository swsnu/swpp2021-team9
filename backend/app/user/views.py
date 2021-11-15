""" User views
views for user
TODO ("implement")
"""
from rest_framework import viewsets
from .serializers import UserSerializer
from .models import CustomUser


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
