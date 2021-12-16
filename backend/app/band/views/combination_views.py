""" Band views
combination views for band
TODO ("implement")
"""
from collections import defaultdict
import json
from django.http.request import HttpRequest
from django.db.models import Count
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import mixins, generics, status
from rest_framework.permissions import AllowAny

from band.models import Combination, Song, CombinationLog, RecoSong
from band.serializers import CombinationSerializer, CombinationLikeSerializer

# pylint: disable=W0613
# disable unused-argument warning, duplicate code


class CombinationSong(mixins.ListModelMixin, generics.GenericAPIView):
    """combination/<int:song_id>/"""

    permission_classes = [AllowAny]
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

        covers = data.pop("covers")
        if covers is None or len(covers) == 0:
            return Response("No covers provided.", status=status.HTTP_400_BAD_REQUEST)

        filtered_covers = Combination.objects.all().annotate(Count("covers"))
        for cover_id in covers:
            filtered_covers = filtered_covers.filter(covers=cover_id)

        filtered_covers = filtered_covers.filter(covers__count=len(covers))
        if len(filtered_covers) > 0:
            instance: Combination = filtered_covers[0]
            serializer: CombinationSerializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        data["user_id"] = request.user.id
        data["song_id"] = song_id
        data["covers_list"] = covers

        serializer: CombinationSerializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CombinationMain(mixins.ListModelMixin, generics.GenericAPIView):
    """combination/main/"""

    serializer_class = CombinationSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            # Get lastest 10 song logs
            last_combi_logs = (
                CombinationLog.objects.filter(user=self.request.user)
                .prefetch_related("combination")
                .order_by("-timestamp")[:5]
            )
            last_song_logs = list(map(lambda x: x.combination.song_id, last_combi_logs))
            last_songs = RecoSong.objects.filter(song_id__in=last_song_logs)
            song_recos = {r.song_id: json.loads(r.recos) for r in last_songs}

            # Get combination by reco
            reco_result = defaultdict(int)
            for i, song_id in enumerate(last_song_logs):
                if song_id not in song_recos:
                    continue
                recos = song_recos[song_id]
                for reco in recos:
                    reco_result[reco] += 1 / (i + 1)
            if reco_result:
                sorted_recos, _ = zip(
                    *sorted(reco_result.items(), key=lambda item: -item[1])
                )
                sorted_recos = list(sorted_recos)
            else:
                sorted_recos = []

            # Fill with general_view if not enought recos
            if len(sorted_recos) < 10:
                general_view = (
                    Combination.objects.all()
                    .order_by("-view")
                    .values_list("id", flat=True)
                    .exclude(id__in=sorted_recos)[: 10 - len(sorted_recos)]
                )
                sorted_recos.extend(general_view)

            # Get recommended combination
            sorted_recoquery = sorted(
                Combination.objects.filter(id__in=sorted_recos[:10]),
                key=lambda x: sorted_recos.index(x.id),
            )

            return sorted_recoquery

        # default recommendation model: order by number of views
        queryset = Combination.objects.all().order_by("-view")[:10]
        return queryset

    def get(self, request: HttpRequest):
        return self.list(request)


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
