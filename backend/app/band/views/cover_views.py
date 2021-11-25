""" Band views
cover views for band
"""
from django.http.request import HttpRequest
from django.http.response import HttpResponseBadRequest
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import mixins, generics, status

from band.models import Cover, Song
from band.serializers import CoverSerializer, CoverLikeSerializer


# pylint: disable=W0613, R0201
# temporarily disable unused-argument, no-self-use warning

class CoverSong(mixins.ListModelMixin, generics.GenericAPIView):
    """cover/<int:song_id>/"""

    queryset = Cover.objects.none()
    serializer_class = CoverSerializer

    def get(self, request: HttpRequest, song_id: int, *args, **kwargs):
        self.queryset = Cover.objects.filter(song__id=song_id)
        return self.list(request, *args, **kwargs)

    def post(self, request: Request, song_id: int, *args, **kwargs):
        data = request.data.copy()
        try:
            Song.objects.get(id=song_id)
        except Song.DoesNotExist as e:
            return HttpResponseBadRequest(e)

        data["song_id"] = song_id

        if data.get("tags") is not None:
            data["tags_list"] = data.pop("tags")

        # data["user"] = ...
        # TODO add user field

        serializer: CoverSerializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CoverSongInstrument(mixins.ListModelMixin, generics.GenericAPIView):
    """cover/<int:song_id>/<int:instrument_id>/"""

    queryset = Cover.objects.none()
    serializer_class = CoverSerializer

    def get(
        self, request: HttpRequest, song_id: int, instrument_id: int, *args, **kwargs
    ):
        self.queryset = Cover.objects.filter(
            song__id=song_id, instrument__id=instrument_id
        )
        return self.list(request, *args, **kwargs)


class CoverInfo(mixins.RetrieveModelMixin, generics.GenericAPIView):
    """cover/info/<int:pk>/"""

    queryset = Cover.objects.all()
    serializer_class = CoverSerializer

    def update(self, request: Request, *args, **kwargs):
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

    def get(self, request: HttpRequest, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request: HttpRequest, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request: HttpRequest, *args, **kwargs):
        instance: Cover = self.get_object()
        instance.delete()
        return Response()


class CoverLike(generics.GenericAPIView):
    """cover/like/<int:pk>/"""

    queryset = Cover.objects.all()
    serializer_class = CoverLikeSerializer

    def get(self, request: Request, *args, **kwargs):
        instance: Cover = self.get_object()
        serializer: CoverLikeSerializer = self.get_serializer(instance)

        user_id = 1  # TODO
        res_data = {"isLike": user_id in serializer.data.get("likes")}
        return Response(res_data, content_type="application/json")

    def put(self, request: Request, *args, **kwargs):
        instance = self.get_object()
        serializer_old: CoverLikeSerializer = self.get_serializer(instance)
        likes: list = serializer_old.data.get("likes")

        isLike = request.data.get("isLike")
        if isLike is None:
            return HttpResponseBadRequest()

        user_id = 1  # TODO

        if isLike:
            if user_id not in likes:
                # like the cover
                likes.append(user_id)
                serializer: CoverLikeSerializer = self.get_serializer(
                    instance, data={"likes": likes}, partial=True
                )
                serializer.is_valid(raise_exception=True)
                serializer.save()
        else:
            if user_id in likes:
                # unlike the cover
                likes.remove(user_id)
                serializer: CoverLikeSerializer = self.get_serializer(
                    instance, data={"likes": likes}, partial=True
                )
                serializer.is_valid(raise_exception=True)
                serializer.save()

        res_data = {"isLike": isLike}
        return Response(res_data, content_type="application/json")
