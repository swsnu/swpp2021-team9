from django.urls import path
from band.views import token_views, user_views, instrument_views, \
    cover_views, combination_views, song_views

urlpatterns = [
    path('token/', token_views.token, name='token'),

    path('user/signup/', user_views.UserSignup.as_view(), name='user_signup'),
    path('user/signin/', user_views.UserSignin.as_view(), name='user_signin'),
    path('user/signout/', user_views.UserSignout.as_view(), name='user_signout'),
    path('user/info/<int:id>/', user_views.UserInfo.as_view(), name='user_info'),

    path('instrument/', instrument_views.Instrument.as_view(), name='instrument'),

    path('cover/info/<int:id>/', cover_views.CoverInfo.as_view(), name='cover_info'),
    path('cover/like/<int:id>/', cover_views.CoverLike.as_view(), name='cover_like'),
    path('cover/<int:songid>/<int:instrumentid>/',
         cover_views.CoverSongInstrument.as_view(), name='cover_song_instrument'),
    path('cover/<int:songid>/', cover_views.CoverSong.as_view(), name='cover_song'),

    path('combination/info/<int:id>/',
         combination_views.CombinationInfo.as_view(), name='combination_info'),
    path('combination/like/<int:id>/',
         combination_views.CombinationLike.as_view(), name='combination_like'),
    path('combination/<int:songid>/',
         combination_views.CombinationSong.as_view(), name='combination_song'),

    path('song/main/', song_views.SongMain.as_view(), name='song_main'),
    path('song/search/?q=<str:key>/',
         song_views.SongSearch.as_view(), name='song_search'),
    path('song/info/<int:id>/', song_views.SongInfo.as_view(), name='song_info'),
    path('song/', song_views.Song.as_view(), name='song')
]
