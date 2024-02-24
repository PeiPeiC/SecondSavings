from django.urls import path
from TimeTracker import views

app_name = 'TimeTracker'

urlpatterns = [
    path('',views.user_login,name='user_login'),
    path('login/', views.user_login, name='user_login'),
    path('reset/', views.user_reset, name='user_reset'),
    path('signup/', views.user_signup, name='user_signup'),
    path('groupStudy/', views.group_study, name='group_study'),
    path('topStudyTimes', views.top_study_times, name='top_study_times'),
    path('',views.main,name='mian'),
    # profile
    path(r'^profile/$',views.profile, name='profile'),
    path(r'profile/update/$', views.profile_update, name='profile_update')
]
