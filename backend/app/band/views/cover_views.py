""" Band views
cover views for band
TODO ("implement")
"""
from django.http import HttpResponse
from django.http.request import HttpRequest
from django.views import View


class CoverSong(View):
    """cover/<int:songid>/"""

    def get(self, request: HttpRequest, songid: int):
        return HttpResponse(status=200)

    def post(self, request: HttpRequest, songid: int):
        return HttpResponse(status=201)


class CoverSongInstrument(View):
    """cover/<int:songid>/<int:instrumentid>/"""

    def get(self, request: HttpRequest, songid: int, instrumentid: int):
        return HttpResponse(status=200)


class CoverInfo(View):
    """cover/info/<int:id>/"""

    def get(self, request: HttpRequest, id: int):
        return HttpResponse(status=200)

    def put(self, request: HttpRequest, id: int):
        return HttpResponse(status=200)

    def delete(self, request: HttpRequest, id: int):
        return HttpResponse(status=204)


class CoverLike(View):
    """cover/like/<int:id>/"""

    def get(self, request: HttpRequest, id: int):
        return HttpResponse(status=200)

    def put(self, request: HttpRequest, id: int):
        return HttpResponse(status=200)
