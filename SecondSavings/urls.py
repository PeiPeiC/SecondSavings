"""
URL configuration for SecondSavings project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import statistics
from django.contrib import admin
from django.urls import path
from SecondSavings import settings

from TimeTracker import views

from django.urls import path,include
from TimeTracker import views
from django.conf.urls.static import static

from django.urls import re_path

urlpatterns = [
    path("main/", views.main, name='main'),
    path('',views.main,name='main'),
    # path('login/', views.user_login, name='user_login'),
    path("login_main/", views.login_main, name='login_main'),
    path("admin/", admin.site.urls),
    path('secondSavings/', include('TimeTracker.urls')),
    path('accounts/', include('allauth.urls')),
    path('report/', views.report, name='report'),
    path('Group/', views.table, name='table'),
    path('MusicList/', views.music, name='music'),
    path('Coin/', views.coin, name='coin'),
    path('Settings/', views.setting, name='setting'),
    path('Badges/', views.badges, name='badges'),

]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
