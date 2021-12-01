""" User views
views for user
TODO ("implement")
"""

from django.http import HttpResponse
from django.http.request import HttpRequest
from django.views import View
from django.contrib.auth import authenticate, login, logout, get_user_model
from rest_framework import mixins, generics
from .serializers import UserSerializer

User = get_user_model()


# pylint: disable=W0613, R0201
# temporarily disable unused-argument, no-self-use warning


class UserSignup(View):
    """user/signup/"""

    def post(self, request: HttpRequest):
        data = request.data
        email = data["email"]
        password = data["password"]
        User.objects.create_user(email, password)
        return HttpResponse(status=201)


class UserSignin(View):
    """user/signin/"""

    def post(self, request: HttpRequest):
        data = request.data
        email = data["email"]
        password = data["password"]
        user = authenticate(request, email=email, password=password)

        if user is not None:  # If user exists
            login(request, user)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)


class UserSignout(View):
    """user/signout/"""

    def get(self, request: HttpRequest):
        if request.user.is_authenticated:
            logout(request)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)


class UserInfo(mixins.RetrieveModelMixin, generics.GenericAPIView):
    """user/info/`pk:int`/"""

    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request: HttpRequest, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
