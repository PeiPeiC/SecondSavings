from django.urls import path
from TimeTracker import views

app_name = 'TimeTracker'

urlpatterns = [
    path('',views.user_login,name='user_login'),
    path('login/', views.user_login, name='user_login'),
    path('reset/', views.user_reset, name='user_reset'),
    path('signup/', views.user_signup, name='user_signup'),
]
