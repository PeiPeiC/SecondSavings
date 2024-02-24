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

    path('groupStudy/', views.group_study, name='group_study'),
    path('topStudyTimes', views.top_study_times, name='top_study_times'),
    path('',views.main,name='mian'),
    # profile
    path(r'^profile/$',views.profile, name='profile'),
    path(r'profile/update/$', views.profile_update, name='profile_update')
]
