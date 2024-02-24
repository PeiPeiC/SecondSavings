from django.urls import path, include
from TimeTracker import views

app_name = 'TimeTracker'

urlpatterns = [
    path('', views.main, name='main'),
    path("main/", views.main, name='main'),
    path("login_main/", views.login_main, name='login_main'),

    path('report/', views.report, name='report'),
    path('Group/', views.table, name='table'),
    path('MusicList/', views.music, name='music'),
    path('Coin/', views.coin, name='coin'),
    path('Settings/', views.setting, name='setting'),
    path('Badges/', views.badges, name='badges'),
    # profile
    path('profile/', views.profile, name='profile'),
    path('profile/update/', views.profile_update, name='profile_update'),
    path('profile/avater_update/', views.avatar_update, name='avatar_update'),

    # setting
    path('setting/', views.setting, name='setting'),
    path('setting/sync_google_task', views.setting_sync, name='setting_sync_google_task'),
    path('setting/update_alarm', views.alarm_update, name='setting_update_alarm'),


    path('groupStudy/', views.group_study, name='group_study'),
    path('topStudyTimes', views.top_study_times, name='top_study_times'),
    path('',views.main,name='mian'),
    # profile
    path(r'^profile/$',views.profile, name='profile'),
    path(r'profile/update/$', views.profile_update, name='profile_update')
]
