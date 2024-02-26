from django.urls import path
from TimeTracker import views

app_name = 'TimeTracker'

urlpatterns = [
    path('',views.main,name='mian'),
    # profile
    path('profile/<slug:username>/',views.profile, name='profile'),
    path('profile/update/<slug:username>', views.profile_update, name='profile_update'),
    path('userInfo/<slug:username>/', views.index),
    path('report/<slug:username>/', views.report),
    path('Group/<slug:username>/', views.table),
    path('MusicList/<slug:username>/', views.music),
    path('Coin/<slug:username>/', views.coin),
    path('Settings/<slug:username>/', views.setting),
    path('Badges/<slug:username>/', views.badges),
]
