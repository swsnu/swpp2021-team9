""" User views
views for user
"""
from json.decoder import JSONDecodeError
from django.http.request import HttpRequest
from django.contrib.auth import authenticate, login, logout, get_user_model
from rest_framework import mixins, generics, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from .serializers import UserSerializer

User = get_user_model()


# pylint: disable=W0613, R0201
# temporarily disable unused-argument, no-self-use warning


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
    serializer_class = UserSerializer

    def get(self, request: HttpRequest, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request: HttpRequest, *args, **kwargs):
        if request.user.id != kwargs["pk"]:
            return Response(status=status.HTTP_403_FORBIDDEN)

        return self.update(request, *args, **kwargs)

    def delete(self, request: HttpRequest, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
