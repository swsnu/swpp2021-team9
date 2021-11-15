from django.urls import path
from band.views import token_views, user_views, instrument_views, \
    cover_views, combination_views, song_views

urlpatterns = [
    path('token/', token_views.token, name='token'),

    path('user/signup/', user_views.user_signup, name='user_signup'),
    path('user/signin/', user_views.user_signin, name='user_signin'),
    path('user/signout/', user_views.user_signout, name='user_signout'),
    path('user/info/<int:id>/', user_views.user_info, name='user_info'),

    path('instrument/', instrument_views.instrument, name='instrument'),

    path('cover/info/<int:id>/', cover_views.cover_info, name='cover_info'),
    path('cover/like/<int:id>/', cover_views.cover_like, name='cover_like'),
    path('cover/<int:songid>/<int:instrumentid>/',
         cover_views.cover_song_instrument, name='cover_song_instrument'),
    path('cover/<int:songid>/', cover_views.cover_song, name='cover_song'),

    path('combination/info/<int:id>/',
         combination_views.combination_info, name='combination_info'),
    path('combination/like/<int:id>/',
         combination_views.combination_like, name='combination_like'),
    path('combination/<int:songid>/',
         combination_views.combination_song, name='combination_song'),

    path('song/main/', song_views.song_main, name='song_main'),
    path('song/search/?q=<str:key>/', song_views.song_search, name='song_search'),
    path('song/info/<int:id>/', song_views.song_info, name='song_info'),
    path('song/', song_views.song, name='song')
]
