from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
import json

from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib import messages
from TimeTracker.forms import LoginForm, ResetPasswordForm, SignUpForm
from TimeTracker.models import Group, UserProfile
from django.views.decorators.csrf import csrf_exempt

from TimeTracker.models import UserProfile


def main(request):
    return render(request, 'TimeTracker/main.html')


#Group study funtion
def group_study(request):                                                       
    group_instance = Group.objects.first()  
    members = group_instance.members.all()
    context = {
        'group': group_instance,
        'members': members
    }
    return render(request, 'TimeTracker/group_study.html', context)

#Study Time Ranking Popup 
def top_study_times(request):                                                                       
    top_users = UserProfile.objects.all().order_by('-study_time')[:3]
    data = {
        'top_users': [
            {'username': profile.user.username, 'study_time': profile.study_time}
            for profile in top_users
        ]
    }
    return JsonResponse(data)
@login_required
def profile(request):
    try:
        user_profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        messages.error(request, 'Invalid Login')
        user_profile = UserProfile()
        # return redirect('/accounts/login/')
    return render(request, 'TimeTracker/userinfo.html', {'user_profile': user_profile})


@login_required
@csrf_exempt
def profile_update(request):
    if request.method == 'POST':
        user_profile = UserProfile.objects.get(user=request.user)

        form_data = request.POST
        nick_name = form_data.get('nickName')

        user_profile.nickName = nick_name
        user_profile.save()

        messages.add_message(request, messages.SUCCESS, 'Update Successfully')
        return redirect('TimeTracker:profile')
    else:
        user_profile = UserProfile()

    return render(request, 'TimeTracker/userInfo.html', context={'user_profile': user_profile, 'user': request.user})


@login_required
def avatar_update(request):
    if request.method == "POST":
        data = json.loads(request.body)
        avatar_data = data.get('avatarData', None)
        if avatar_data:
            user_profile = UserProfile.objects.get(user=request.user)
            user_profile.avatar = avatar_data
            user_profile.save()
            return render(request, 'TimeTracker/userInfo.html',
                          context={'username': request.user.username, 'user_profile': user_profile})
        else:
            messages.error(request, 'Invalid Image')
    else:
        return render(request, 'TimeTracker/userInfo.html',
                      context={'username': request.user.username})


def index(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/userInfo.html')


def report(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/report.html')


def table(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/Group.html')


def music(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/music.html')


def coin(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/coin.html')


def setting(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/setting.html')


def badges(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/badges.html')


def report(request):
    return render(request, 'TimeTracker/report.html')
