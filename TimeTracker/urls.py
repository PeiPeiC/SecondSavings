from django.urls import path, include
from TimeTracker import views

app_name = 'TimeTracker'

urlpatterns = [
    path('', views.main, name='main'),
    path("main/", views.main, name='main'),
    path("login_main/", views.login_main, name='login_main'),

    # profile
    path('profile/', views.profile, name='profile'),
    path('profile/update/', views.profile_update, name='profile_update'),
    path('profile/avater_update/', views.avatar_update, name='avatar_update'),
<<<<<<< HEAD

    # setting
    path('setting/', views.setting, name='setting'),
    path('setting/sync_google_task', views.setting_sync, name='setting_sync_google_task'),
    path('setting/update_alarm', views.alarm_update, name='setting_update_alarm'),

    path('report/', views.report, name='report'),
    path('Coin/', views.coin, name='coin'),
    path('Badges/', views.badges, name='badges'),

    path('Group/', views.group, name='group'),
    path('get_user_groups/', views.get_user_groups, name='get_user_groups'),
    path('create_group/', views.create_group, name='create_group'),
    path('delete_group/<int:group_id>/', views.delete_group, name='delete_group'),
    path('quit_group/<int:group_id>/', views.quit_group, name='quit_group'),
    path('search_group/', views.search_group, name='search_group'),
    path('join_group/<int:group_id>/', views.join_group, name='join_group'),
    path('groupStudy/<int:group_id>/', views.group_study, name='group_study'),
    path('topStudyTimes', views.top_study_times, name='top_study_times'),

    path('create_task/', views.create_task, name='create_task'),
    path('update_task_date/', views.update_task_date, name='update_task_date'),
    path('delete_task/', views.delete_task, name='delete_task'),
    path('delete_incomplete_tasks/', views.delete_incomplete_tasks, name='delete_incomplete_tasks'),
    path('get_tasks/', views.get_tasks, name='get_tasks'),
    path('start_record/', views.start_record, name='start_record'),
    path('end_record/', views.end_record, name='end_record'),
    path('finish_task/', views.finish_task, name='finish_task'),
    path('get_task_info/', views.get_task_info, name='get_task_info'),
=======
    path("login_main/", views.login_main, name='login_main'),
    # path("privacy_policy/", views.privacy_policy, name='privacy_policy'),
    # path("terms_of_service/", views.terms_of_service, name='terms_of_service'),
>>>>>>> 862e582 (add privacy page)
]
