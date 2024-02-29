import base64
import json
import random
import string
from io import BytesIO

from PIL import Image
from django.core.files.base import ContentFile
from django.http import HttpResponse, JsonResponse
import base64
import json
import random
import string
from io import BytesIO

from PIL import Image
from django.contrib.auth.decorators import login_required
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt

from TimeTracker.models import UserProfile, UserSetting, Group
import logging


logger = logging.getLogger('django')


def main(request):
    return render(request, 'TimeTracker/main.html')


@login_required
def profile(request):
    user_profile, created = UserProfile.objects.get_or_create(user=request.user)
    return render(request, 'TimeTracker/userInfo.html', {'user_profile': user_profile})


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
                logger.info(f'Old avatar deleted for user {request.user.username}')  # debug log
            rand_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
            user_profile.avatar.save(f'{request.user.username}_{rand_str}.jpg', ContentFile(image_io.getvalue()), save=False)
            logger.info(f'New avatar saved: {request.user.username}_{rand_str}.jpg for user {request.user.username}')
            user_profile.save()

            return render(request, 'TimeTracker/base.html', context={'user_profile': user_profile})
        else:
            messages.error(request, 'Invalid Image')
            logger.warning(f'Invalid image data received for user {request.user.username}')
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

@login_required
def login_main(request):
    return render(request, 'TimeTracker/login_main.html')
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


def index(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/userInfo.html')


def line_chart(request):
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

