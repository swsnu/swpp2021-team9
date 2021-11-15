""" Band views
cover views for band
TODO ("implement")
"""
from django.http import HttpResponse
from django.http.request import HttpRequest
from django.views import View

# pylint: disable=W0613, R0201
# temporarily disable unused-argument, no-self-use warning


class CoverSong(View):
    """cover/<int:song_id>/"""

    def get(self, request: HttpRequest, song_id: int):
        return HttpResponse(status=200)

    def post(self, request: HttpRequest, song_id: int):
        return HttpResponse(status=201)


class CoverSongInstrument(View):
    """cover/<int:song_id>/<int:instrument_id>/"""

    def get(self, request: HttpRequest, song_id: int, instrument_id: int):
        return HttpResponse(status=200)


class CoverInfo(View):
    """cover/info/<int:cover_id>/"""

    def get(self, request: HttpRequest, cover_id: int):
        return HttpResponse(status=200)

    def put(self, request: HttpRequest, cover_id: int):
        return HttpResponse(status=200)

    def delete(self, request: HttpRequest, cover_id: int):
        return HttpResponse(status=204)


class CoverLike(View):
    """cover/like/<int:cover_id>/"""

    def get(self, request: HttpRequest, cover_id: int):
        return HttpResponse(status=200)

    def put(self, request: HttpRequest, cover_id: int):
        return HttpResponse(status=200)
