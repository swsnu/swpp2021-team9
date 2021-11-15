""" Band views
song views for band
TODO ("implement")
"""
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotFound
from django.http.request import HttpRequest
from django.views import View


# song/
class Song(View):
    def get(self, request: HttpRequest):
        return HttpResponse(status=200)

    def post(self, request: HttpRequest):
        return HttpResponse(status=201)


# song/main/
class SongMain(View):
    def get(self, request: HttpRequest):
        return HttpResponse(status=200)


# song/search/
class SongSearch(View):
    def get(self, request: HttpRequest):
        return HttpResponse(status=200)


# song/
class SongInfo(View):
    def get(self, request: HttpRequest):
        return HttpResponse(status=200)

    def put(self, request: HttpRequest):
        return HttpResponse(status=200)
