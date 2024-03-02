import base64
import json
import random
import string
from io import BytesIO

from PIL import Image
from django.core.files.base import ContentFile
from django.utils import timezone
from datetime import datetime, date, timedelta
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
from django.views.decorators.csrf import csrf_exempt
from TimeTracker.forms import GroupCreateForm
from TimeTracker.models import Group, UserProfile, Task, Record, UserSetting
from django.views.decorators.csrf import csrf_exempt
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
<<<<<<< HEAD

=======
            
>>>>>>> e814e1b (solve the avatar upload issue for old users)
            if user_profile.avatar:
                user_profile.avatar.delete()  # delete the old one
                logger.info(f'Old avatar deleted for user {request.user.username}')  # debug log
            rand_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
<<<<<<< HEAD
            user_profile.avatar.save(f'{request.user.username}_{rand_str}.jpg', ContentFile(image_io.getvalue()),
                                     save=False)
            logger.info(f'New avatar saved: {request.user.username}_{rand_str}.jpg for user {request.user.username}')
=======
            user_profile.avatar.save(f'{request.user.username}_{rand_str}.jpg', ContentFile(image_io.getvalue()), save=False)
            
>>>>>>> e814e1b (solve the avatar upload issue for old users)
            user_profile.save()

            return render(request, 'TimeTracker/base.html', context={'user_profile': user_profile})
        else:
            messages.error(request, 'Invalid Image')
<<<<<<< HEAD
            logger.warning(f'Invalid image data received for user {request.user.username}')
    return render(request, 'TimeTracker/userInfo.html', context={'user_profile': user_profile})
=======
    return render(request, 'TimeTracker/userInfo.html', context={'user_profile': user_profile})

>>>>>>> e814e1b (solve the avatar upload issue for old users)


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


def group(request):
    groups = Group.objects.filter(members=request.user)
    return render(request, 'TimeTracker/Group.html', {'groups': groups})


# get user groups
def get_user_groups(request):
    if request.user.is_authenticated:
        groups = request.user.group_memberships.all().values(
            'id', 'name', 'creator__username'
        )
        groups_data = [
            {
                'id': group['id'],
                'name': group['name'],
                'creator': group['creator__username'],
                'is_creator': request.user.username == group['creator__username']
            }
            for group in groups
        ]
        return JsonResponse({'groups': groups_data})
    return JsonResponse({'groups': []})


# create group
def create_group(request):
    form = GroupCreateForm(request.POST)
    if form.is_valid():
        new_group = form.save(commit=False)
        new_group.creator = request.user
        new_group.key = request.POST.get('key')  # 获取并设置小组密码
        new_group.save()
        new_group.members.add(request.user)
        # 如果需要，保存多对多关系
        form.save_m2m()
        # 返回成功响应

        return JsonResponse({
            'success': True,
            'groupName': new_group.name,
            'creatorName': new_group.creator.username,
            'groupId': new_group.id  # 新组的ID，用于创建链接
        })

    else:
        # 返回错误响应
        return JsonResponse({'success': False, 'error': form.errors})

    # delete group


def delete_group(request, group_id):
    try:
        group = Group.objects.get(id=group_id, creator=request.user)  # Make sure only the creator can delete
        group.delete()
        return JsonResponse({'success': True})
    except Group.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Group not found.'}, status=404)


def search_group(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        group_name = data.get('groupName')
        groups = Group.objects.filter(name__icontains=group_name)
        print(f"Search Group")
        return JsonResponse({
            'groups': list(groups.values('id', 'name', 'creator__username'))
        })


def join_group(request, group_id):
    if request.method == 'POST':
        group = get_object_or_404(Group, id=group_id)
        data = json.loads(request.body)
        user_key = data.get('key')
        print(f"User key: {user_key}, Group key: {group.key}")

        if user_key == group.key:
            group.members.add(request.user)
            print(f"Adding user {request.user} to group {group}")
            group.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'error': 'Wrong Key!'})

    return JsonResponse({'success': False, 'error': 'Invalid request'})


def quit_group(request, group_id):
    if request.method == 'POST':
        group = get_object_or_404(Group, id=group_id)
        if request.user in group.members.all():
            group.members.remove(request.user)
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'error': 'You are not a member of this group.'})

    return JsonResponse({'success': False, 'error': 'Invalid request method.'})


# Group study funtion
def group_study(request, group_id):
    group_instance = get_object_or_404(Group, id=group_id)
    members = group_instance.members.all()
    context = {
        'group': group_instance,
        'members': members
    }
    return render(request, 'TimeTracker/group_study.html', context)


# Study Time Ranking Popup
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



#点击submit后创建task
def create_task(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        task_type = request.POST.get('taskType')
        task_date = request.POST.get('taskDate')
        # 创建并保存任务对象
        task = Task(user=request.user, title=title, category=task_type, chosenDate=task_date)
        task.save()
        return JsonResponse({'status': 'success', 'task_id': task.id, 'TotalTaskTime': task.totalTaskTime,
                             'TotalBreakTime': task.totalBreakTime, 'chosenDate': task.chosenDate})
    return JsonResponse({'status': 'error'}, status=400)


# 更改task日期
def update_task_date(request):
    if request.method == 'POST':
        task_id = request.POST.get('task_id')
        new_date = request.POST.get('new_date')
        task = Task.objects.get(id=task_id, user=request.user)
        task.chosenDate = new_date
        task.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)


# 点击delete后删除task
def delete_task(request):
    task_id = request.POST.get('task_id')
    task = get_object_or_404(Task, pk=task_id, user=request.user)
    task.delete()
    return JsonResponse({'status': 'success'})


def delete_incomplete_tasks(request):
    if request.method == 'POST':
        # 删除当前登录用户的所有未完成任务
        Task.objects.filter(user=request.user, isCompleted=False).delete()
        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)


# 点击finish后调用
def finish_task(request):
    task_id = request.POST.get('taskId')
    isCompleted = request.POST.get('isCompleted') == 'true'
    endTime = request.POST.get('endTime')
    print("Received endTime from frontend:", endTime)
    task = get_object_or_404(Task, pk=task_id, user=request.user)
    task.isCompleted = isCompleted
    # task.endTime = endTime
    task.endTime = timezone.now()
    task.save()
    return JsonResponse({'status': 'success'})


def get_task_info(request):
    task_id = request.GET.get('taskId')
    task = get_object_or_404(Task, pk=task_id)
    return JsonResponse({
        'title': task.title,
        'category': task.category,
        'chosenDate': task.chosenDate,
        'isCompleted': task.isCompleted,
        'endtime': task.endTime.isoformat() if task.endTime else None,
        'TotalTaskTime': task.totalTaskTime,
        'TotalBreakTime': task.totalBreakTime,
    })


# 前端获取用户task，保证每次刷新网页都保留已创建的task
def get_tasks(request):
    tasks = Task.objects.filter(user=request.user).values()  # 获取当前用户的任务
    return JsonResponse(list(tasks), safe=False)  # 将任务列表转换为JSON格式并返回


# startTimer()触发后调用，新建对应record
def start_record(request):
    if request.method == 'POST':
        task_id = request.POST.get('taskId')
        record_type = request.POST.get('recordType', 'task')  # 默认为 'task'
        print(task_id)
        task = get_object_or_404(Task, pk=task_id, user=request.user)
        # task = Task.objects.get(pk=task_id)
        record = Record.objects.create(task=task, user=request.user, type=record_type, startTime=timezone.now())
        return JsonResponse({'record_id': record.pk})


# Fix postgreSql bug version end_record funtion
def time_to_timedelta(time_obj):
    return timedelta(hours=time_obj.hour, minutes=time_obj.minute, seconds=time_obj.second)


def add_timedelta_to_time(original_time, time_delta):
    original_timedelta = time_to_timedelta(original_time)
    new_timedelta = original_timedelta + time_delta
    return (datetime.min + new_timedelta).time()


def end_record(request):
    if request.method == 'POST':
        record_id = request.POST.get('recordId')
        record = Record.objects.get(pk=record_id)
        record.endTime = timezone.now()
        record.save()

        time_delta = record.endTime - record.startTime

        user_profile = UserProfile.objects.get(user=record.user)
        task = record.task

        if record.type == 'task':
            task_type = task.category

            # 更新了时间的处理方式
            if task_type == "Work":
                user_profile.work_time = add_timedelta_to_time(user_profile.work_time, time_delta)
                task.totalTaskTime = add_timedelta_to_time(task.totalTaskTime, time_delta)
            elif task_type == "Study":
                user_profile.study_time = add_timedelta_to_time(user_profile.study_time, time_delta)
                task.totalTaskTime = add_timedelta_to_time(task.totalTaskTime, time_delta)
            else:
                user_profile.life_time = add_timedelta_to_time(user_profile.life_time, time_delta)
                task.totalTaskTime = add_timedelta_to_time(task.totalTaskTime, time_delta)
        else:
            task.totalBreakTime = add_timedelta_to_time(task.totalBreakTime, time_delta)

        user_profile.save()
        task.save()

        return JsonResponse({'status': 'success'})


"""  #pauseTimer()触发后调用
def end_record(request): 
    if request.method == 'POST':
        record_id = request.POST.get('recordId')
        record = Record.objects.get(pk=record_id)
        record.endTime = timezone.now()
        record.save()
        # 这里可以计算study_time并更新UserProfile 还没实现
        # 计算学习时间
        
        time_delta = record.endTime - record.startTime

        user_profile = UserProfile.objects.get(user=record.user)
        task = record.task
        # 更新UserProfile里的study_time\work_time\life_time  task中的totalTaskTime
        if(record.type == 'task'):
            # 获取当前的累积学习时间
            current_user_study_time = user_profile.study_time
            current_task_task_time = task.totalTaskTime
            # 将 timedelta 转换为时间
            new_user_task_type_time = (datetime.combine(date.min, current_user_study_time) + time_delta).time()
            new_task_task_time = (datetime.combine(date.min, current_task_task_time) + time_delta).time() 

            task_type = task.category
            if task_type == "Work":
                user_profile.work_time = new_user_task_type_time
                record.task.totalTaskTime = new_task_task_time
            elif task_type =="Study":
                user_profile.study_time = new_user_task_type_time
                record.task.totalTaskTime = new_task_task_time    
            else:
                user_profile.life_time = new_user_task_type_time
                record.task.totalTaskTime = new_task_task_time

        else:
            # 更新task的totalBreakTime
            current_task_break_time = task.totalBreakTime
            # 将 timedelta 转换为时间
            new_task_break_time = (datetime.combine(date.min, current_task_break_time) + time_delta).time() 
            task.totalBreakTime = new_task_break_time

        user_profile.save()
        task.save()
        
        return JsonResponse({'status': 'success'})  """
