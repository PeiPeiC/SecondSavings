from django.urls import path
from TimeTracker import views

app_name = 'TimeTracker'

urlpatterns = [
    path('',views.main,name='mian'),
    # profile
    path('profile/<slug:username>/',views.profile, name='profile'),
    path('profile/update/<slug:username>', views.profile_update, name='profile_update')
]
