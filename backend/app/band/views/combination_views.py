""" Band views
combination views for band
TODO ("implement")
"""
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotAllowed, HttpResponseNotFound
from django.http.request import HttpRequest
from django.views import View


# combination/<int:songid>/
class CombinationSong(View):
    def get(self, request: HttpRequest):
        return HttpResponse(status=200)

    def post(self, request: HttpRequest):
        return HttpResponse(status=201)


# combination/info/<int:id>/
class CombinationInfo(View):
    def get(self, request: HttpRequest):
        return HttpResponse(status=200)


# combination/like/<int:id>/
class CombinationLike(View):
    def get(self, request: HttpRequest):
        return HttpResponse(status=200)

    def put(self, request: HttpRequest):
        return HttpResponse(status=200)
