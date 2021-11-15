""" Band views
cover views for band
TODO ("implement")
"""
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotAllowed, HttpResponseNotFound
from django.http.request import HttpRequest
from django.views import View


# cover/<int:songid>/
class CoverSong(View):
    def get(self, request: HttpRequest):
        return HttpResponse(status=200)

    def post(self, request: HttpRequest):
        return HttpResponse(status=201)


# cover/<int:songid>/<int:instrumentid>/
class CoverSongInstrument(View):
    def get(self, request: HttpRequest):
        return HttpResponse(status=200)


# cover/info/<int:id>/
class CoverInfo(View):
    def get(self, request: HttpRequest):
        return HttpResponse(status=200)

    def put(self, request: HttpRequest):
        return HttpResponse(status=200)

    def delete(self, request: HttpRequest):
        return HttpResponse(status=204)


# cover/like/<int:id>/
class CoverLike(View):
    def get(self, request: HttpRequest):
        return HttpResponse(status=200)

    def put(self, request: HttpRequest):
        return HttpResponse(status=200)
