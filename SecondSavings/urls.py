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
from django.contrib import admin
from SecondSavings import settings
from TimeTracker import views
from django.urls import path,include
from django.conf.urls.static import static
from TimeTracker.views import oauth2callback
from django.urls import re_path

urlpatterns = [
    
    path('',views.main,name='main'),
    path("main/", views.main, name='main'),
    # path('login/', views.user_login, name='user_login'),
    path('accounts/', include('allauth.urls')),

    path("login_main/", views.login_main, name='login_main'),
    path("login_main_count_down", views.login_main_count_down, name='login_main_count_down'),
    # Django admin
    path("admin/", admin.site.urls),
    # Django-allauth routes for authentication
    path('secondSavings/', include('TimeTracker.urls')),
    path('oauth2callback/', views.oauth2callback, name='oauth2callback'),
    path('oauth2/initiate/', views.initiate_oauth2_process, name='initiate_oauth2_process'),

]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
    # Include your app's urls here
    
# Static and media files in development

# Make sure static files are served correctly in the development environment as well.
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
