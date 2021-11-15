""" Band views
combination views for band
TODO ("implement")
"""
from django.http import HttpResponse
from django.http.request import HttpRequest
from django.views import View


class CombinationSong(View):
    """combination/<int:song_id>/"""

    def get(self, request: HttpRequest, song_id: int):
        return HttpResponse(status=200)

    def post(self, request: HttpRequest, song_id: int):
        return HttpResponse(status=201)


class CombinationInfo(View):
    """combination/info/<int:combination_id>/"""

    def get(self, request: HttpRequest, combination_id: int):
        return HttpResponse(status=200)


class CombinationLike(View):
    """combination/like/<int:combination_id>/"""

    def get(self, request: HttpRequest, combination_id: int):
        return HttpResponse(status=200)

    def put(self, request: HttpRequest, combination_id: int):
        return HttpResponse(status=200)
