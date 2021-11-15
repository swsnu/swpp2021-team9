""" Band views
combination views for band
TODO ("implement")
"""
from django.http import HttpResponse
from django.http.request import HttpRequest
from django.views import View


class CombinationSong(View):
    """combination/<int:songid>/"""

    def get(self, request: HttpRequest, songid: int):
        return HttpResponse(status=200)

    def post(self, request: HttpRequest, songid: int):
        return HttpResponse(status=201)


class CombinationInfo(View):
    """combination/info/<int:id>/"""

    def get(self, request: HttpRequest, id: int):
        return HttpResponse(status=200)


class CombinationLike(View):
    """combination/like/<int:id>/"""

    def get(self, request: HttpRequest, id: int):
        return HttpResponse(status=200)

    def put(self, request: HttpRequest, id: int):
        return HttpResponse(status=200)
