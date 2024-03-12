from django.urls import path, include
from TimeTracker import views

app_name = 'TimeTracker'

urlpatterns = [
    path('', views.main, name='main'),
    path("main/", views.main, name='main'),
     # profile
    path('profile/',views.profile, name='profile'),
    path('profile/update/', views.profile_update, name='profile_update'),
    path('profile/avater_update/', views.avatar_update, name='avatar_update'),
    path("login_main/", views.login_main, name='login_main'),
    # path("privacy_policy/", views.privacy_policy, name='privacy_policy'),
    # path("terms_of_service/", views.terms_of_service, name='terms_of_service'),
]
