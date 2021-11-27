""" User views
views for user
TODO ("implement")
"""
from rest_framework import viewsets
from django.http import HttpResponse
from django.http.request import HttpRequest
from django.views import View
from .serializers import UserSerializer
from .models import CustomUser
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
import json

# pylint: disable=W0613, R0201
# temporarily disable unused-argument, no-self-use warning


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for user"""

    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


class UserSignup(View):
    """user/signup/"""

    def post(self, request: HttpRequest):
        data = request.data
        email = data['email']
        password = data['password']
        User.objects.create_user(email, password)
        return HttpResponse(status = 201)


class UserSignin(View):
    """user/signin/"""

    def post(self, request: HttpRequest):
        data = request.data
        email = data['email']
        password = data['password']
        user = authenticate(request, email = email, password=password)

        if user is not None: # If user exists
            login(request, user)
            return HttpResponse(status = 204)
        else : 
            return HttpResponse(status = 401)

class UserSignout(View):
    """user/signout/"""

    def get(self, request: HttpRequest):
        if request.user.is_authenticated:
            logout(request)
            return HttpResponse(status = 204)
        else : 
            return HttpResponse(status = 401)


class UserInfo(View):
    """user/info/<int:user_id>/"""

    def get(self, request: HttpRequest, user_id: int):
        return HttpResponse(status=501)

    def put(self, request: HttpRequest, user_id: int):
        return HttpResponse(status=501)

    def delete(self, request: HttpRequest, user_id: int):
        return HttpResponse(status=501)
