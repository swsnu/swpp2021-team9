""" Band views
song views for band
TODO ("implement")
"""
from django.http.request import HttpRequest
from django.db.models import Count
from rest_framework import mixins, generics, filters

from band.models import Song
from band.serializers import SongSerializer

# pylint: disable=W0613
# temporarily disable unused-argument, no-self-use warning


class SongView(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    """song/"""

    queryset = Song.objects.all()
    serializer_class = SongSerializer

    def get(self, request: HttpRequest):
        return self.list(request)

    def post(self, request: HttpRequest):
        return self.create(request)


class SongMain(mixins.ListModelMixin, generics.GenericAPIView):
    """song/main/"""

    serializer_class = SongSerializer

    def get_queryset(self):
        queryset = Song.objects.all()
        if self.request.user.is_authenticated:
            # if user is logged in, should recommend based on the user
            return queryset

        # default recommendation model: order by number of covers
        queryset = queryset.annotate(cover_count=Count("covers")).order_by(
            "-cover_count"
        )
        return queryset

    def get(self, request: HttpRequest):
        return self.list(request)


class SongSearch(mixins.ListModelMixin, generics.GenericAPIView):
    """song/search/?search="""

    queryset = Song.objects.all()
    serializer_class = SongSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "singer"]

    def get(self, request: HttpRequest):
        return self.list(request)


class SongInfo(
    mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView
):
    """song/info/`int:pk`/"""

    queryset = Song.objects.all()
    serializer_class = SongSerializer

    def get(self, request: HttpRequest, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request: HttpRequest, *args, **kwargs):
        return self.update(request, *args, **kwargs, partial=True)
