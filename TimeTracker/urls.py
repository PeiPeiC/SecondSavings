from django.urls import path, include
from TimeTracker import views

app_name = 'TimeTracker'

urlpatterns = [
    # profile
    path('profile/',views.profile, name='profile'),
    path('profile/update/', views.profile_update, name='profile_update'),
    path('profile/avater_update/', views.avatar_update, name='avatar_update')

    path('accounts/', include('allauth.urls')),
    path('', views.main, name='main'),
    path("main/", views.main, name='main'),
]
