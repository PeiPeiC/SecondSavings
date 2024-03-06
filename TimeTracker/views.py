import base64
import json
import random
import string
from io import BytesIO

from PIL import Image
from django.contrib.auth.decorators import login_required
from django.core.files.base import ContentFile
from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt

from TimeTracker.models import UserProfile, UserSetting


def main(request):
    return render(request, 'TimeTracker/main.html')


@login_required
def profile(request):
    try:
        user_profile, created = UserProfile.objects.get_or_create(user=request.user)
    except UserProfile.DoesNotExist:
        messages.error(request, 'Invalid Login')
        user_profile = UserProfile()
        # return redirect('/accounts/login/')
    return render(request, 'TimeTracker/userinfo.html', {'user_profile': user_profile})


@login_required
@csrf_exempt
def profile_update(request):
    if request.method == 'POST':
        user_profile, created = UserProfile.objects.get_or_create(user=request.user)
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
        user_profile, created = UserProfile.objects.get_or_create(user=request.user)
        data = json.loads(request.body)
        avatar_data = data.get('avatarData', None)

        if avatar_data:
            file_data = avatar_data.split(',')[1]  # remove data:image/png;base64,
            image_data_decoded = base64.b64decode(file_data)
            image = Image.open(BytesIO(image_data_decoded))
            image_io = BytesIO()
            image.save(image_io, format='JPEG')
            
            if user_profile.avatar:
                user_profile.avatar.delete()  # delete the old one

            rand_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
            user_profile.avatar.save(f'{request.user.username}_{rand_str}.jpg', ContentFile(image_io.getvalue()), save=False)
            
            user_profile.save()

            return render(request, 'TimeTracker/base.html', context={'user_profile': user_profile})
        else:
            messages.error(request, 'Invalid Image')
    return render(request, 'TimeTracker/userInfo.html', context={'user_profile': user_profile})


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
    try:
        user_setting, _ = UserSetting.objects.get_or_create(user=request.user)
        user_profile, _ = UserProfile.objects.get_or_create(user=request.user)
    except UserSetting.DoesNotExist:
        messages.error(request, 'Invalid Login')
        user_setting = UserSetting()
        user_profile = UserProfile()

    return render(request, 'TimeTracker/setting.html',
                  context={'user_setting': user_setting,
                           'alarm_choices': UserSetting.ALARM_CHOICES,
                           'user_profile': user_profile})


def setting_sync(request):
    user_setting = UserSetting.objects.get(user=request.user)
    user_profile = UserProfile.objects.get(user=request.user)
    if request.method == 'POST':
        data = json.loads(request.body)
        sync = data.get('isSync', False)

        user_setting.syncGoogleTask = sync
        user_setting.save()

        messages.add_message(request, messages.SUCCESS, 'Update Successfully')
        return redirect('TimeTracker:setting')

    return render(request, 'TimeTracker/setting.html',
                  context={'user_setting': user_setting,
                           'user': request.user,
                           'user_profile': user_profile,
                           'alarm_url': user_setting.get_url()})


def alarm_update(request):
    user_setting = UserSetting.objects.get(user=request.user)
    if request.method == 'POST':
        data = json.loads(request.body)
        url = data.get('alarmSelected', None)
        alarm = user_setting.get_alarm(url)
        if alarm:
            if alarm != user_setting.alarm:
                user_setting.alarm = alarm
                user_setting.save()

    return render(request, 'TimeTracker/setting.html',
                  context={'user_setting': user_setting,
                           'user': request.user,
                           'alarm_url': user_setting.get_url()})


def badges(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/badges.html')


def report(request):
    return render(request, 'TimeTracker/report.html')


def main(request):
    return render(request, 'TimeTracker/main.html')


@login_required
def login_main(request):
    return render(request, 'TimeTracker/login_main.html')
