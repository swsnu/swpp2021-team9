""" Band views
combination views for band
TODO ("implement")
"""
from django.http.request import HttpRequest
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import mixins, generics, status

from band.models import Combination, Song
from band.serializers import CombinationSerializer, CombinationLikeSerializer

# pylint: disable=W0613
# disable unused-argument warning, duplicate code


class CombinationSong(mixins.ListModelMixin, generics.GenericAPIView):
    """combination/<int:song_id>/"""

    queryset = Combination.objects.none()
    serializer_class = CombinationSerializer

    def get(self, request: HttpRequest, song_id: int, *args, **kwargs):
        self.queryset = Combination.objects.filter(song__id=song_id)
        return self.list(request, *args, **kwargs)

    def post(self, request: Request, song_id: int):
        try:
            Song.objects.get(id=song_id)
        except Song.DoesNotExist:
            return Response("Song does not exist.", status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data["user_id"] = request.user.id
        data["song_id"] = song_id

        covers = data.pop("covers")
        if covers is None or len(covers) == 0:
            return Response("No covers provided.", status=status.HTTP_400_BAD_REQUEST)

        data["covers_list"] = covers

        serializer: CombinationSerializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CombinationInfo(mixins.RetrieveModelMixin, generics.GenericAPIView):
    """combination/info/<int:pk>/"""

    queryset = Combination.objects.all()
    serializer_class = CombinationSerializer

    def get(self, request: HttpRequest, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class CombinationLike(generics.GenericAPIView):
    """combination/like/<int:pk>/"""

    queryset = Combination.objects.all()
    serializer_class = CombinationLikeSerializer

    def get(self, request: HttpRequest, *args, **kwargs):
        instance: Combination = self.get_object()
        serializer: CombinationLikeSerializer = self.get_serializer(instance)

        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        res_data = {"isLiked": request.user.id in serializer.data.get("likes")}
        return Response(res_data, content_type="application/json")

    def put(self, request: Request, *args, **kwargs):
        instance = self.get_object()
        serializer_old: CombinationLikeSerializer = self.get_serializer(instance)
        likes: list = serializer_old.data.get("likes")

        is_like = request.data.get("isLiked")
        if is_like is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user_id = request.user.id

        if is_like:
            if user_id not in likes:
                # like the cover
                likes.append(user_id)
                serializer: CombinationLikeSerializer = self.get_serializer(
                    instance, data={"likes": likes}, partial=True
                )
                serializer.is_valid(raise_exception=True)
                serializer.save()
        else:
            if user_id in likes:
                # unlike the cover
                likes.remove(user_id)
                serializer: CombinationLikeSerializer = self.get_serializer(
                    instance, data={"likes": likes}, partial=True
                )
                serializer.is_valid(raise_exception=True)
                serializer.save()

        res_data = {"isLiked": is_like}
        return Response(res_data, content_type="application/json")
