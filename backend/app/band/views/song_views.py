""" Band views
song views for band
TODO ("implement")
"""
from django.http import HttpResponse
from django.http.request import HttpRequest
from django.views import View


class SongView(View):
    """song/"""

    def get(self, request: HttpRequest):
        return HttpResponse(status=200)

    def post(self, request: HttpRequest):
        return HttpResponse(status=201)


class SongMain(View):
    """song/main/"""

    def get(self, request: HttpRequest):
        return HttpResponse(status=200)


class SongSearch(View):
    """song/search/<str:key>/"""

    def get(self, request: HttpRequest, key: str):
        return HttpResponse(status=200)


class SongInfo(View):
    """song/info/<int:song_id>/"""

    def get(self, request: HttpRequest, song_id: int):
        return HttpResponse(status=200)

    def put(self, request: HttpRequest, song_id: int):
        return HttpResponse(status=200)
