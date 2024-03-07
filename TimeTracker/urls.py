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
    

 
    path('create_task/', views.create_task, name='create_task'),
    path('delete_task/', views.delete_task, name='delete_task'),
    path('delete_incomplete_tasks/', views.delete_incomplete_tasks, name='delete_incomplete_tasks'),
    path('get_tasks/', views.get_tasks, name='get_tasks'),
    path('start_record/', views.start_record, name='start_record'),
    path('end_record/', views.end_record, name='end_record'),
    path('finish_task/', views.finish_task, name='finish_task'),
    path('get_task_info/', views.get_task_info, name='get_task_info'),
]
