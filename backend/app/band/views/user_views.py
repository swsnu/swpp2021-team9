""" Band views
user views for band
TODO ("implement")
"""
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotFound
from django.http.request import HttpRequest
from django.views import View


# user/signup/
class UserSignup(View):
    def post(self, request: HttpRequest):
        return HttpResponse(status=201)


# user/signin/
class UserSignin(View):
    def post(self, request: HttpRequest):
        return HttpResponse(status=204)


# user/signout/
class UserSignout(View):
    def get(self, request: HttpRequest):
        return HttpResponse(status=204)


# user/info/<int:id>/
class UserInfo(View):
    def get(self, request: HttpRequest):
        return HttpResponse(status=200)

    def put(self, request: HttpRequest):
        return HttpResponse(status=200)

    def delete(self, request: HttpRequest):
        return HttpResponse(status=204)
