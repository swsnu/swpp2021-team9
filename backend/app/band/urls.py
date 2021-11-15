from django.urls import path
from band.views import token_views, user_views, instrument_views, \
    cover_views, combination_views, song_views

urlpatterns = [
    path('token/', token_views.token, name='token'),

    path('user/signup/', user_views.UserSignup, name='user_signup'),
    path('user/signin/', user_views.UserSignin, name='user_signin'),
    path('user/signout/', user_views.UserSignout, name='user_signout'),
    path('user/info/<int:id>/', user_views.UserInfo, name='user_info'),

    path('instrument/', instrument_views.Instrument, name='instrument'),

    path('cover/info/<int:id>/', cover_views.CoverInfo, name='cover_info'),
    path('cover/like/<int:id>/', cover_views.CoverLike, name='cover_like'),
    path('cover/<int:songid>/<int:instrumentid>/',
         cover_views.CoverSongInstrument, name='cover_song_instrument'),
    path('cover/<int:songid>/', cover_views.CoverSong, name='cover_song'),

    path('combination/info/<int:id>/',
         combination_views.CombinationInfo, name='combination_info'),
    path('combination/like/<int:id>/',
         combination_views.CombinationLike, name='combination_like'),
    path('combination/<int:songid>/',
         combination_views.CombinationSong, name='combination_song'),

    path('song/main/', song_views.SongMain, name='song_main'),
    path('song/search/?q=<str:key>/', song_views.SongSearch, name='song_search'),
    path('song/info/<int:id>/', song_views.SongInfo, name='song_info'),
    path('song/', song_views.Song, name='song')
]
