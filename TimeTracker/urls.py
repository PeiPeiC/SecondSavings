from django.urls import path
from TimeTracker import views

app_name = 'TimeTracker'

urlpatterns = [
    path('',views.main,name='mian'),
    # profile
    path('profile/',views.profile, name='profile'),
    path('profile/update/', views.profile_update, name='profile_update'),
    path('profile/avater_update/', views.avatar_update, name='avatar_update'),

    # setting
    path('setting/', views.setting, name='setting'),
    path('setting/sync_google_task', views.setting_sync, name='setting_sync_google_task')
]
