"""Band urls
Urls for band
"""

from django.urls import path
from band.views import (
    token_views,
    instrument_views,
    cover_views,
    combination_views,
    song_views,
)

urlpatterns = [
    path("token/", token_views.token, name="token"),
    # instrument urls
    path(
        "instrument/",
        instrument_views.InstrumentView.as_view({"get": "list"}),
        name="instrument",
    ),
    # cover urls
    path("cover/info/<int:pk>/", cover_views.CoverInfo.as_view(), name="cover_info"),
    path("cover/like/<int:pk>/", cover_views.CoverLike.as_view(), name="cover_like"),
    path(
        "cover/<int:song_id>/<int:instrument_id>/",
        cover_views.CoverSongInstrument.as_view(),
        name="cover_song_instrument",
    ),
    path("cover/<int:song_id>/", cover_views.CoverSong.as_view(), name="cover_song"),
    # combination urls
    path(
        "combination/info/<int:pk>/",
        combination_views.CombinationInfo.as_view(),
        name="combination_info",
    ),
    path(
        "combination/like/<int:pk>/",
        combination_views.CombinationLike.as_view(),
        name="combination_like",
    ),
    path(
        "combination/<int:song_id>/",
        combination_views.CombinationSong.as_view(),
        name="combination_song",
    ),
    # song urls
    path("song/main/", song_views.SongMain.as_view(), name="song_main"),
    path("song/search/", song_views.SongSearch.as_view(), name="song_search"),
    path("song/info/<int:song_id>/", song_views.SongInfo.as_view(), name="song_info"),
    path("song/", song_views.SongView.as_view(), name="song"),
]
