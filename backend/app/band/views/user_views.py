""" Band views
user views for band
TODO ("implement")
"""
from django.http import HttpResponse
from django.http.request import HttpRequest
from django.views import View


class UserSignup(View):
    """user/signup/"""

    def post(self, request: HttpRequest):
        return HttpResponse(status=201)


class UserSignin(View):
    """user/signin/"""

    def post(self, request: HttpRequest):
        return HttpResponse(status=204)


class UserSignout(View):
    """user/signout/"""

    def get(self, request: HttpRequest):
        return HttpResponse(status=204)


class UserInfo(View):
    """user/info/<int:user_id>/"""

    def get(self, request: HttpRequest, user_id: int):
        return HttpResponse(status=200)

    def put(self, request: HttpRequest, user_id: int):
        return HttpResponse(status=200)

    def delete(self, request: HttpRequest, user_id: int):
        return HttpResponse(status=204)
