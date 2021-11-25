""" Band views
cover views for band
TODO ("implement")
"""
from django.http import HttpResponse
from django.http.request import HttpRequest
from django.views import View
from rest_framework.response import Response
from rest_framework import mixins, generics

from band.models import Cover
from band.serializers import CoverSerializer

# pylint: disable=W0613, R0201
# temporarily disable unused-argument, no-self-use warning


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


class CoverInfo(mixins.RetrieveModelMixin, generics.GenericAPIView):
    """cover/info/<int:cover_id>/"""

    queryset = Cover.objects.all()
    serializer_class = CoverSerializer

    def update(self, request: HttpRequest, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy()
        if data.get("tags") is not None:
            data["tags_list"] = data.pop("tags")
        serializer: CoverSerializer = self.get_serializer(
            instance, data=data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request: HttpRequest, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request: HttpRequest, *args, **kwargs):
        instance: Cover = self.get_object()
        instance.delete()
        return Response()


class CoverLike(View):
    """cover/like/<int:cover_id>/"""

    def get(self, request: HttpRequest, cover_id: int):
        return HttpResponse(status=501)

    def put(self, request: HttpRequest, cover_id: int):
        return HttpResponse(status=501)
