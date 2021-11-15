""" User views
views for user
TODO ("implement")
"""
from .serializers import UserSerializer
from .models import CustomUser
from rest_framework import viewsets


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
