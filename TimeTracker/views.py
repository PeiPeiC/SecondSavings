from django.utils import timezone
from datetime import datetime, date
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
import base64
import json
import random
import string
from io import BytesIO

from PIL import Image
from django.contrib.auth.decorators import login_required
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from TimeTracker.models import Group, UserProfile, Task, Record
from django.views.decorators.csrf import csrf_exempt



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
            file_data = avatar_data.split(',')[1]  # remove data:image/png;base64,
            image_data_decoded = base64.b64decode(file_data)
            image = Image.open(BytesIO(image_data_decoded))
            image_io = BytesIO()
            image.save(image_io, format='JPEG')
            user_profile = UserProfile.objects.get(user=request.user)
            if user_profile.avatar:
                user_profile.avatar.delete()  # delete the old one

            rand_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
            user_profile.avatar.save(request.user.username + '_' + rand_str + '.jpg', ContentFile(image_io.getvalue()),
                                     save=True)

            return render(request, 'TimeTracker/base.html',
                          context={'user_file': user_profile})
        else:
            messages.error(request, 'Invalid Image')
    else:
        return render(request, 'TimeTracker/userInfo.html',
                      context={'username': request.user.username})


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


def main(request):
    return render(request, 'TimeTracker/main.html')


@login_required
def login_main(request):
    return render(request, 'TimeTracker/login_main.html')




#点击submit后创建task
def create_task(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        start_time = request.POST.get('startTime')
        totalSeconds = request.POST.get('totalSeconds')
        # 创建并保存任务对象
        task = Task(user=request.user, title=title, startTime=start_time,totalSeconds=totalSeconds)
        task.save()
        return JsonResponse({'status': 'success', 'task_id': task.id})
    return JsonResponse({'status': 'error'}, status=400)

#点击delete后删除task
def delete_task(request):
    task_id = request.POST.get('task_id')
    task = get_object_or_404(Task, pk=task_id, user=request.user)
    task.delete()
    return JsonResponse({'status': 'success'})



#前端获取用户task，保证每次刷新网页都保留已创建的task
def get_tasks(request):
    tasks = Task.objects.filter(user=request.user).values()  # 获取当前用户的任务
    return JsonResponse(list(tasks), safe=False)  # 将任务列表转换为JSON格式并返回


#startTimer()触发后调用，新建对应record
def start_record(request):
    if request.method == 'POST':
        task_id = request.POST.get('taskId')
        print(task_id)
        task = get_object_or_404(Task, pk=task_id, user=request.user)
        #task = Task.objects.get(pk=task_id)
        record = Record.objects.create(task=task, user=request.user, startTime=timezone.now())
        return JsonResponse({'record_id': record.pk})

#pauseTimer()触发后调用，新建对应record
def end_record(request):
    if request.method == 'POST':
        record_id = request.POST.get('recordId')
        record = Record.objects.get(pk=record_id)
        record.endTime = timezone.now()
        record.save()
        # 这里可以计算study_time并更新UserProfile 还没实现
        # 计算学习时间
        study_time_delta = record.endTime - record.startTime

        # 获取当前的累积学习时间
        user_profile = UserProfile.objects.get(user=record.user)
        current_study_time = user_profile.study_time

        # 将 timedelta 转换为时间
        new_study_time = (datetime.combine(date.min, current_study_time) + study_time_delta).time()

        # 更新UserProfile里的study_time
        user_profile.study_time = new_study_time
        user_profile.save()

        return JsonResponse({'status': 'success'})