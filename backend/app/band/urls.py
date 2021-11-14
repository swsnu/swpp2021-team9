from django.urls import path
from band.views import user_views, instrument_views, cover_views, combination_views, song_views

urlpatterns = [
    path('user/signup/', user_views.user_signup),
    path('user/signin/', user_views.user_signin),
    path('user/signout/', user_views.user_signout),
    path('user/info/<int:id>/', user_views.user_info),

    path('instrument/', instrument_views.instrument),

    path('cover/info/<int:id>/', cover_views.cover_info),
    path('cover/like/<int:id>/', cover_views.cover_like),
    path('cover/<int:songid>/<int:instrumentid>/',
         cover_views.cover_song_instrument),
    path('cover/<int:songid>/', cover_views.cover_song),

    path('combination/info/<int:id>/', combination_views.combination_info),
    path('combination/like/<int:id>/', combination_views.combination_like),
    path('combination/<int:songid>/', combination_views.combination_song),

    path('song/main/', song_views.song_main),
    path('song/search/?q=<str:key>/', song_views.song_search),
    path('song/info/<int:id>/', song_views.song_info),
    path('song/', song_views.song)
]
