from allauth.socialaccount.models import SocialAccount
from django.utils import timezone
from datetime import datetime, timedelta
from django.http import JsonResponse, HttpResponse
import base64
import json
import random
import string
from io import BytesIO
import requests
from PIL import Image
from django.contrib.auth.decorators import login_required
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from TimeTracker.forms import GroupCreateForm
from TimeTracker.models import Group, UserProfile, Task, Record, UserSetting, TaskTableItem, TimeReportResp, \
    TaskCategoryReportResp, TaskCompletedReportResp
from django.views.decorators.csrf import csrf_exempt
import logging
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from django.conf import settings
from urllib.parse import urlencode
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

logger = logging.getLogger('django')


def main(request):
    if request.user.is_authenticated:
        user_setting, created = UserSetting.objects.get_or_create(user=request.user)
        if created:
            logger.info(f"user {request.user} setting created.")
        return redirect('login_main')
    else:
        user_setting = UserSetting()

    return render(request, 'TimeTracker/main.html', context={'alarm_url': user_setting.get_url()})


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

        # messages.add_message(request, messages.SUCCESS, 'Update Successfully')
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
            user_profile.avatar.save(f'{request.user.username}_{rand_str}.jpg', ContentFile(image_io.getvalue()),
                                     save=False)
            logger.info(f'New avatar saved: {request.user.username}_{rand_str}.jpg for user {request.user.username}')
            user_profile.save()

            return render(request, 'TimeTracker/base.html', context={'user_profile': user_profile})
        else:
            # messages.error(request, 'Invalid Image')
            logger.warning(f'Invalid image data received for user {request.user.username}')
    return render(request, 'TimeTracker/userInfo.html', context={'user_profile': user_profile})


@login_required
def report(request, time_range):
    user_profile, created = UserProfile.objects.get_or_create(user=request.user)
    if created:
        logger.info(f'user {request.user} create profile')

    now = datetime.now()
    if time_range == 'week':
        left_time = now - timedelta(days=6)
        labels = [(left_time + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(7)]

    elif time_range == 'month':
        left_time = now - timedelta(days=30)
        labels = get_previous_four_weeks_start_dates()

    elif time_range == 'year':
        left_time = now - timedelta(days=365)
        labels = get_previous_year_month_start_dates()

    else:  # default week
        left_time = datetime.now() - timedelta(days=7)
        labels = [(left_time + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(7)]

    all_tasks = Task.objects.filter(user=request.user, chosenDate__range=(left_time, datetime.now())).order_by(
        'chosenDate')
    if len(all_tasks) == 0:
        return render(request, 'TimeTracker/report.html',
                      {'time_range': time_range,
                       'user_profile': user_profile,
                       })

    times_bar_data = time_bar(all_tasks, labels, time_range)
    tasks_category_bar_data = tasks_category_bar(all_tasks, labels, time_range)
    task_completed_line_data = task_completed_line(all_tasks, labels, time_range)

    return render(request, 'TimeTracker/report.html',
                  {'time_range': time_range,
                   'user_profile': user_profile,
                   'time_bar': times_bar_data,
                   'category_bar': tasks_category_bar_data,
                   'completed_line': task_completed_line_data,
                   })


def task_completed_line(tasks, labels, time_range):
    tasks_completed = {}
    for label in labels:
        tasks_completed[label] = 0

    for task in tasks:
        task_date = task.chosenDate
        if time_range == 'week':
            key = task_date.strftime('%Y-%m-%d')
        elif time_range == 'month':
            key = (task_date - timedelta(days=task_date.weekday())).strftime('%Y-%m-%d')
        elif time_range == 'year':
            key = task_date.replace(day=1).strftime('%Y-%m-%d')
        else:
            key = task_date.strftime('%Y-%m-%d')

        if task.isCompleted:
            tasks_completed[key] = tasks_completed.get(key, 0) + 1
        else:
            continue

    tasks_completed = [(int(count)) for date, count in tasks_completed.items()]
    return TaskCompletedReportResp(labels, tasks_completed)


def tasks_category_bar(tasks, labels, time_range):
    work_tasks = {}
    life_tasks = {}
    study_tasks = {}
    for label in labels:
        work_tasks[label] = 0
        life_tasks[label] = 0
        study_tasks[label] = 0

    for task in tasks:
        task_date = task.chosenDate
        if time_range == 'week':
            key = task_date.strftime('%Y-%m-%d')
        elif time_range == 'month':
            key = (task_date - timedelta(days=task_date.weekday())).strftime('%Y-%m-%d')
        elif time_range == 'year':
            key = task_date.replace(day=1).strftime('%Y-%m-%d')
        else:
            key = task_date.strftime('%Y-%m-%d')

        if task.category == 'Work':
            work_tasks[key] = work_tasks.get(key, 0) + 1
        elif task.category == 'Study':
            study_tasks[key] = study_tasks.get(key, 0) + 1
        elif task.category == 'Life':
            life_tasks[key] = life_tasks.get(key, 0) + 1
        else:
            continue

    logger.info(f'{work_tasks}, {life_tasks}, {study_tasks}, {labels}')
    work_tasks = [(int(count)) for date, count in work_tasks.items()]
    life_tasks = [(int(count)) for date, count in life_tasks.items()]
    study_tasks = [(int(count)) for date, count in study_tasks.items()]
    return TaskCategoryReportResp(labels, work_tasks, life_tasks, study_tasks)


def time_bar(tasks, labels, time_range):
    task_time_totals = {}
    break_time_totals = {}
    # init
    for label in labels:
        task_time_totals[label] = 0
        break_time_totals[label] = 0

    for task in tasks:
        task_date = task.chosenDate
        tasks_time, breaks_time = task.total_seconds()
        if time_range == 'week':
            key = task_date.strftime('%Y-%m-%d')
            task_time_totals[key] = task_time_totals.get(key, 0) + int(tasks_time / 60)  # mins
            break_time_totals[key] = break_time_totals.get(key, 0) + int(breaks_time / 60)

        elif time_range == 'month':
            week_start = (task_date - timedelta(days=task_date.weekday())).strftime('%Y-%m-%d')
            task_time_totals[week_start] = task_time_totals.get(week_start, 0) + int(tasks_time / 60)
            break_time_totals[week_start] = break_time_totals.get(week_start, 0) + int(breaks_time / 60)

        elif time_range == 'year':
            month_start = task_date.replace(day=1).strftime('%Y-%m-%d')
            task_time_totals[month_start] = task_time_totals.get(month_start, 0) + int(tasks_time / 60)
            break_time_totals[month_start] = break_time_totals.get(month_start, 0) + int(breaks_time / 60)

    logger.info(f'{task_time_totals}, {break_time_totals}, {labels}')
    task_total_time_list = [(int(total_time)) for date, total_time in task_time_totals.items()]
    break_total_time_list = [(int(total_time)) for date, total_time in break_time_totals.items()]

    return TimeReportResp(labels, task_total_time_list, break_total_time_list)


def get_previous_four_weeks_start_dates():
    today = datetime.now()

    # find Monday
    start_of_current_week = today - timedelta(days=today.weekday())

    start_dates = []

    for _ in range(4):
        start_dates.append(start_of_current_week.strftime('%Y-%m-%d'))
        start_of_current_week -= timedelta(days=7)

    start_dates.reverse()
    return start_dates


def get_previous_year_month_start_dates():
    today = datetime.now()

    # find first day of the month
    start_of_current_month = today.replace(day=1)

    start_dates = []

    while start_of_current_month.year == today.year:
        start_dates.append(start_of_current_month.strftime('%Y-%m-%d'))
        # last month
        start_of_current_month = start_of_current_month - timedelta(days=start_of_current_month.day)

    start_dates.reverse()
    return start_dates


def table(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/Group.html')


def music(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/music.html')


@login_required
def coin(request):
    user_profile, created = UserProfile.objects.get_or_create(user=request.user)
    user_setting, created = UserSetting.objects.get_or_create(user=request.user)
    tasks = Task.objects.filter(user=request.user).order_by('chosenDate')
    all_tasks = []
    total_hours = 0
    total_amount = 0
    for task in tasks:
        item = TaskTableItem(task, user_setting)
        all_tasks.append(item)
        total_amount += item.amount
        total_hours += item.task_hours

    return render(request, 'TimeTracker/coin.html',
                  {'user_profile': user_profile,
                   'user_setting': user_setting,
                   'tasks': all_tasks,
                   'total_hours': total_hours,
                   'total_amount': total_amount})


@login_required
def coin_update(request):
    if request.method == 'POST':
        user_setting = UserSetting.objects.get(user=request.user)
        coin_value = request.POST.get('coin', 1)
        user_setting.coin = coin_value
        user_setting.save()
        return redirect('TimeTracker:coin')
    else:
        return HttpResponse('Invalid request method')


def privacy_policy(request):
    return render(request, 'TimeTracker/privacy_policy.html')


def terms_of_service(request):
    return render(request, 'TimeTracker/terms_of_service.html')


def setting(request):
    user_setting, created = UserSetting.objects.get_or_create(user=request.user)
    user_profile, _ = UserProfile.objects.get_or_create(user=request.user)

    if created:
        logger.info(f'User {request.user.username} create setting')

    return render(request, 'TimeTracker/setting.html',
                  context={'user_setting': user_setting,
                           'alarm_choices': UserSetting.ALARM_CHOICES,
                           'user_profile': user_profile,
                           'is_google_account': is_google_user(request.user)})


def setting_sync(request):
    user_setting = UserSetting.objects.get(user=request.user)
    user_profile = UserProfile.objects.get(user=request.user)
    if request.method == 'POST':
        data = json.loads(request.body)
        sync = data.get('isSync', False)

        user_setting.syncGoogleTask = sync
        user_setting.save()

        # messages.add_message(request, messages.SUCCESS, 'Update Successfully')
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


@login_required
def login_main(request):
    return render(request, 'TimeTracker/login_main.html')


def login_main_count_down(request):
    user_setting = UserSetting()
    return render(request, 'TimeTracker/login_main_count_down.html', context={'alarm_url': user_setting.get_url()})


def group(request):
    groups = Group.objects.filter(members=request.user)
    return render(request, 'TimeTracker/Group.html', {'groups': groups})


@login_required
def group(request):
    groups = Group.objects.filter(members=request.user)
    user_profile, _ = UserProfile.objects.get_or_create(user=request.user)
    return render(request, 'TimeTracker/Group.html',
                  {'groups': groups, 'user_profile': user_profile})


# get user groups
def get_user_groups(request):
    if request.user.is_authenticated:
        groups = request.user.group_memberships.all().values(
            'id', 'name', 'creator__username', 'creator__userprofile__nickName'
        )
        groups_data = [
            {
                'id': group['id'],
                'name': group['name'],
                'creator': group['creator__username'],
                'creatorNickName': group['creator__userprofile__nickName'],
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

        user_profile = request.user.userprofile
        return JsonResponse({
            'success': True,
            'groupName': new_group.name,
            'creatorName': new_group.creator.username,
            'creatorNickName': user_profile.nickName,
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
def top_study_times(request, group_id):
    group = get_object_or_404(Group, id=group_id)
    # top_users = UserProfile.objects.all().order_by('-study_time')[:3]
    top_users = UserProfile.objects.filter(user__in=group.members.all()).order_by('-study_time')[:3]
    data = {
        'top_users': [
            {'nickName': profile.nickName, 'study_time': profile.study_time}
            for profile in top_users
        ]
    }
    return JsonResponse(data)


def index(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/userInfo.html')


def get_google_tasks_service(user):
    user_settings = UserSetting.objects.get(user=user)
    credentials = Credentials(
        token=user_settings.google_access_token,
        refresh_token=user_settings.google_refresh_token,
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        token_uri='https://oauth2.googleapis.com/token'
    )
    service = build('tasks', 'v1', credentials=credentials)
    return service


def ensure_work_list_exists(service, title):
    page_token = None
    #   print(f"Checking for Task list with title: {title}")
    while True:
        response = service.tasklists().list(maxResults=100, pageToken=page_token).execute()
        for item in response.get('items', []):
            #    print(f"Found Task list: {item['title']}")
            if item['title'].lower() == title.lower():
                return item['id']

        page_token = response.get('nextPageToken')
        if not page_token:
            break

    # 如果没有找到，创建一个新的工作列表
    tasklist = service.tasklists().insert(body={'title': title}).execute()
    return tasklist['id']


def add_task_to_tasklist(service, tasklist_id, task_title):
    task = {'title': task_title}
    result = service.tasks().insert(tasklist=tasklist_id, body=task).execute()
    return result['id']  # 返回新创建的任务的ID


def add_task_to_google_tasks(user, tasklist_id, task_title):
    service = get_google_tasks_service(user)
    task = {'title': task_title}
    result = service.tasks().insert(tasklist=tasklist_id, body=task).execute()
    return result['id']  # 返回新创建的Google Tasks任务的ID


# 点击submit后创建task
def create_task(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        task_type = request.POST.get('taskType')
        task_date = request.POST.get('taskDate')
        # 创建并保存任务对象
        task = Task(user=request.user, title=title, category=task_type, chosenDate=task_date)
        # 检查并更新Google Tasks
        user_setting, created = UserSetting.objects.get_or_create(user=request.user)
        if created:
            logger.info(f'{request.user} create setting')

        if user_setting.syncGoogleTask:
            try:
                service = get_google_tasks_service(request.user)
                tasklist_id = ensure_work_list_exists(service, task_type)  # 使用任务类型作为工作列表标题
                google_task_id = add_task_to_tasklist(service, tasklist_id, title)  # 添加任务到工作列表
                task.google_tasklist_id = tasklist_id
                task.google_task_id = google_task_id
                task.save()  # 保存任务，包括Google Tasks信息
            except Exception as e:
                return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

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


def delete_google_task(service, tasklist_id, task_id):
    try:
        # 直接使用任务ID来删除Google Tasks中的任务
        service.tasks().delete(tasklist=tasklist_id, task=task_id).execute()
    except Exception as e:
        # 处理可能出现的错误
        print(f"Error deleting task from Google Tasks: {e}")


# 点击delete后删除task
def delete_task(request):
    if request.method == 'POST':
        task_id = request.POST.get('task_id')
        task = get_object_or_404(Task, pk=task_id, user=request.user)

        user_setting, created = UserSetting.objects.get_or_create(user=request.user)
        if created:
            logger.info(f'{request.user} create setting')

        if user_setting.syncGoogleTask:
            service = get_google_tasks_service(request.user)
            # 从Google Tasks中删除任务
            if task.google_tasklist_id and task.google_task_id:
                delete_google_task(service, task.google_tasklist_id, task.google_task_id)

        task.delete()
        return JsonResponse({'status': 'success'})


def delete_incomplete_count_up_tasks(request):
    if request.method == 'POST':
        # 删除当前登录用户的所有未完成任务
        tasks_to_delete = Task.objects.filter(user=request.user, isCompleted=False, isCountDown=False)

        user_setting, created = UserSetting.objects.get_or_create(user=request.user)
        if created:
            logger.info(f'{request.user} create setting')

        if user_setting.syncGoogleTask:
            service = get_google_tasks_service(request.user)
            # Iterate over the tasks to delete each from Google Tasks if applicable
            for task in tasks_to_delete:
                if task.google_tasklist_id and task.google_task_id:
                    delete_google_task(service, task.google_tasklist_id, task.google_task_id)

        # Now delete the tasks from the database
        tasks_to_delete.delete()

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
        'TotalSeconds': task.totalSeconds,
    })


# 前端获取用户task，保证每次刷新网页都保留已创建的task
def get_count_up_tasks(request):
    # tasks = Task.objects.filter(user=request.user).values()  # 获取当前用户的任务
    tasks = Task.objects.filter(user=request.user, isCountDown=False).values()
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

        # if task.isCountDown == True:
        # time_delta_seconds = time_delta.total_seconds()
        # task.totalSeconds = task.totalSeconds - time_delta_seconds

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

        if task.isCountDown == True and record.type == 'task':
            total_task_time = task.totalTaskTime
            # 将时间转换为秒
            total_seconds = (total_task_time.hour * 3600) + (total_task_time.minute * 60) + total_task_time.second
            print("test")
            task.totalSeconds = task.Duration - total_seconds

        user_profile.save()
        task.save()

        return JsonResponse({'status': 'success'})


def delete_incomplete_count_down_tasks(request):
    if request.method == 'POST':
        # 删除当前登录用户的所有未完成任务
        tasks_to_delete = Task.objects.filter(user=request.user, isCompleted=False, isCountDown=True)

        user_setting, created = UserSetting.objects.get_or_create(user=request.user)
        if created:
            logger.info(f'{request.user} create setting')

        if user_setting.syncGoogleTask:
            service = get_google_tasks_service(request.user)

            for task in tasks_to_delete:
                if task.google_tasklist_id and task.google_task_id:
                    delete_google_task(service, task.google_tasklist_id, task.google_task_id)

        # Now delete the tasks from the database
        tasks_to_delete.delete()
        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)


# 点击submit后创建count down task
def create_count_down_task(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        task_type = request.POST.get('taskType')
        task_date = request.POST.get('taskDate')
        taskDuration = request.POST.get('taskDuration')
        countDown = True
        # 创建并保存任务对象
        task = Task(user=request.user, title=title, category=task_type, chosenDate=task_date, Duration=taskDuration,
                    totalSeconds=taskDuration, isCountDown=countDown)

        user_setting, created = UserSetting.objects.get_or_create(user=request.user)
        if created:
            logger.info(f'{request.user} create setting')

        if user_setting.syncGoogleTask:

            # 检查并更新Google Tasks
            try:
                service = get_google_tasks_service(request.user)
                tasklist_id = ensure_work_list_exists(service, task_type)  # 使用任务类型作为工作列表标题
                google_task_id = add_task_to_tasklist(service, tasklist_id, title)  # 添加任务到工作列表
                task.google_tasklist_id = tasklist_id
                task.google_task_id = google_task_id
                task.save()  # 保存任务，包括Google Tasks信息
            except Exception as e:
                return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
        task.save()
        return JsonResponse({'status': 'success', 'task_id': task.id, 'TotalTaskTime': task.totalTaskTime,
                             'TotalBreakTime': task.totalBreakTime, 'chosenDate': task.chosenDate,
                             'TotalSeconds': task.totalSeconds})
    return JsonResponse({'status': 'error'}, status=400)


def get_count_down_tasks(request):
    # tasks = Task.objects.filter(user=request.user).values()  # 获取当前用户的任务
    tasks = Task.objects.filter(user=request.user, isCountDown=True).values()
    return JsonResponse(list(tasks), safe=False)  # 将任务列表转换为JSON格式并返回


@login_required
def initiate_oauth2_process(request):
    # 定义授权URL和所需的参数
    base_url = 'https://accounts.google.com/o/oauth2/v2/auth?'
    params = {
        'response_type': 'code',
        'client_id': settings.GOOGLE_CLIENT_ID,
        'redirect_uri': settings.REDIRECT_URI,
        'scope': 'https://www.googleapis.com/auth/tasks',
        'access_type': 'offline',  # 用于获取refresh token
        'prompt': 'consent',
    }

    # 构建完整的授权URL
    auth_url = f"{base_url}{urlencode(params)}"

    # 重定向到授权URL
    return JsonResponse({'redirectUrl': auth_url})


@login_required
@csrf_exempt
def update_sync_settings(request):
    if request.method == "POST":
        syncGoogleTask = request.POST.get('syncGoogleTask') == 'true'
        user_setting, _ = UserSetting.objects.get_or_create(user=request.user)
        user_setting.syncGoogleTask = syncGoogleTask
        user_setting.save()
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'Invalid request'}, status=400)


def is_google_user(user):
    try:
        _ = SocialAccount.objects.get(provider__iexact='google', user=user)
        return True
    except SocialAccount.DoesNotExist:
        return False


@login_required
def oauth2callback(request):
    code = request.GET.get('code')
    if code:
        # 准备请求访问令牌所需的数据
        data = {
            'code': code,
            'client_id': settings.GOOGLE_CLIENT_ID,
            'client_secret': settings.GOOGLE_CLIENT_SECRET,
            'redirect_uri': settings.REDIRECT_URI,
            'grant_type': 'authorization_code',
        }

        # 使用授权码获取访问令牌
        token_response = requests.post('https://oauth2.googleapis.com/token', data=data)

        # 检查响应是否成功
        if token_response.status_code == 200:
            token_json = token_response.json()
            access_token = token_json.get('access_token')
            refresh_token = token_json.get('refresh_token')

            # 存储访问令牌和刷新令牌到数据库
            user_setting, _ = UserSetting.objects.get_or_create(user=request.user)
            user_setting.google_access_token = access_token
            user_setting.google_refresh_token = refresh_token
            user_setting.save()

            messages.add_message(request, messages.SUCCESS, 'Google Tasks integration enabled.')
            return redirect('TimeTracker:setting')
        else:
            messages.add_message(request, messages.ERROR, 'Failed to retrieve access token.')
            return redirect('TimeTracker:profile')
    else:
        # 处理没有授权码的情况
        messages.add_message(request, messages.ERROR, 'Authorization failed or cancelled by user.')
        return redirect('TimeTracker:profile')
