""" Band views
cover views for band
TODO ("implement")
"""
from django.http import HttpResponse
from django.http.request import HttpRequest
from django.views import View
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from band.models import Cover
from band.serializers import CoverSerializer

# pylint: disable=W0613, R0201
# temporarily disable unused-argument, no-self-use warning


class CoverViewSet(viewsets.ModelViewSet):
    """Viewset for cover"""

    serializer_class = CoverSerializer

    @action(detail=False, methods=["get"])
    def get_song(self, request: HttpRequest, song_id: int):
        """cover/<int:song_id>/"""
        cover_song = Cover.objects.filter(song_id=song_id).order_by("views")

        page = self.paginate_queryset(cover_song)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(cover_song, many=True)
        return Response(serializer.data)


class CoverSong(View):
    """cover/<int:song_id>/"""

    def get(self, request: HttpRequest, song_id: int):
        return HttpResponse(status=501)

    def post(self, request: HttpRequest, song_id: int):
        return HttpResponse(status=501)


class CoverSongInstrument(View):
    """cover/<int:song_id>/<int:instrument_id>/"""

    def get(self, request: HttpRequest, song_id: int, instrument_id: int):
        return HttpResponse(status=501)


class CoverInfo(View):
    """cover/info/<int:cover_id>/"""

    def get(self, request: HttpRequest, cover_id: int):
        return HttpResponse(status=501)

    def put(self, request: HttpRequest, cover_id: int):
        return HttpResponse(status=501)

    def delete(self, request: HttpRequest, cover_id: int):
        return HttpResponse(status=501)


class CoverLike(View):
    """cover/like/<int:cover_id>/"""

    def get(self, request: HttpRequest, cover_id: int):
        return HttpResponse(status=501)

    def put(self, request: HttpRequest, cover_id: int):
        return HttpResponse(status=501)
