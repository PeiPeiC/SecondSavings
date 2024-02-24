from django.urls import path
from TimeTracker import views

app_name = 'TimeTracker'

urlpatterns = [
    path('',views.user_login,name='user_login'),
    path('login/', views.user_login, name='user_login'),
    path('reset/', views.user_reset, name='user_reset'),
    path('signup/', views.user_signup, name='user_signup'),
    re_path(r'^$', views.userInfo),
    path('admin/', admin.site.urls),
    path('userInfo/', views.userInfo),
    path('report/', views.report),
    path('group/', views.group),
    path('music_list/', views.music_list),
    path('badges/', views.badges),
    path('cion/', views.cion),
    path('settings/', views.settings),
]

