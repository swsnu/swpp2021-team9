from django.urls import path
from band import views

urlpatterns = [
    path('user/signup/', views.userSignup),
    path('user/signin/', views.userSignin),
    path('user/signout/', views.userSignout),
    path('user/info/<int:id>/', views.userInfo),

    path('instrument/', views.instrument),

    path('cover/info/<int:id>/', views.coverInfo),
    path('cover/like/<int:id>/', views.coverLike),
    path('cover/<int:songid>/<int:instrumentid>/', views.coverSongInstrument),
    path('cover/<int:songid>/', views.coverSong),

    path('combination/info/<int:id>/', views.combinationInfo),
    path('combination/like/<int:id>/', views.combinationLike),
    path('combination/<int:songid>/', views.combinationSong),

    path('song/main/', views.songMain),
    path('song/search/?q=<str:key>/', views.songSearch),
    path('song/info/<int:id>/', views.songInfo),
    path('song/', views.song)
]
