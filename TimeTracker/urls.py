from django.urls import path
from TimeTracker import views

app_name = 'TimeTracker'

urlpatterns = [
    path('',views.main,name='mian'),
    path('groupStudy/', views.group_study, name='group_study'),
    path('topStudyTimes', views.top_study_times, name='top_study_times'),
    
    path('',views.main,name='mian'),
    # profile
    path('profile/',views.profile, name='profile'),
    path('profile/update/', views.profile_update, name='profile_update'),
    path('profile/avater_update/', views.avatar_update, name='avatar_update'),





    path('create_task/', views.create_task, name='create_task'),
    path('delete_task/', views.delete_task, name='delete_task'),
    path('get_tasks/', views.get_tasks, name='get_tasks'),
    path('start_record/', views.start_record, name='start_record'),
    path('end_record/', views.end_record, name='end_record'),
]
