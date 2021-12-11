""" User views
views for user
"""
import json
from json.decoder import JSONDecodeError
from django.http.request import HttpRequest
from django.contrib.auth import authenticate, login, logout, get_user_model
from rest_framework import mixins, generics, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from band.models import Instrument
from .serializers.profile_serializers import UserProfileSerializer

User = get_user_model()


class UserSignup(APIView):
    """user/signup/"""

    permission_classes = [AllowAny]

    def post(self, request: Request):
        try:
            data = request.data
            email = data["email"]
            password = data["password"]
        except (KeyError, JSONDecodeError):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        User.objects.create_user(email, password)
        return Response(status=status.HTTP_201_CREATED)


class UserSignin(APIView):
    """user/signin/"""

    permission_classes = [AllowAny]

    def post(self, request: Request):
        try:
            data = request.data
            email = data["email"]
            password = data["password"]
        except (KeyError, JSONDecodeError):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)
        if user is None:
            return Response(
                "Wrong email or password.", status=status.HTTP_401_UNAUTHORIZED
            )

        login(request, user)
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserSignout(APIView):
    """user/signout/"""

    def get(self, request: HttpRequest):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserInfo(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    """user/info/`int:user_id`/"""

    queryset = User.objects.all()
    serializer_class = UserProfileSerializer

    def get(self, request: HttpRequest, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def post(self, request: HttpRequest, **kwargs):
        if request.user.id != kwargs["pk"]:
            return Response(status=status.HTTP_403_FORBIDDEN)

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        new_user = serializer.save()

        instrument_list = request.data.get("instruments")
        if instrument_list is not None:
            try:
                instrument_list = json.loads(instrument_list)
                instruments = Instrument.objects.filter(id__in=instrument_list)
                new_user.instruments.set(instruments)
            except JSONDecodeError:
                return Response("instrument format not json", 400)

        return Response(UserProfileSerializer(new_user).data)

    def delete(self, request: HttpRequest, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
