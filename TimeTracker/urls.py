from django.urls import path
from TimeTracker import views

app_name = 'TimeTracker'

urlpatterns = [
    path('',views.main,name='mian'),
    # profile
    path(r'^profile/$',views.profile, name='profile'),
    path(r'profile/update/$', views.profile_update, name='profile_update')
]
