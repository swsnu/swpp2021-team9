"""Band urls
Urls for user
"""

from django.urls import path
from user import views

urlpatterns = [
    path("signup/", views.UserSignup.as_view(), name="user_signup"),
    path("signin/", views.UserSignin.as_view(), name="user_signin"),
    path("signout/", views.UserSignout.as_view(), name="user_signout"),
    path("info/<int:pk>/", views.UserInfo.as_view(), name="user_info"),
]
