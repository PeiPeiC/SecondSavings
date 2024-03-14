import json
from datetime import datetime, timedelta

from django.contrib.auth.models import User
from django.test import TestCase, Client, RequestFactory
from django.urls import reverse

from TimeTracker.models import UserSetting, UserProfile, Task, Group
from .views import (
    get_user_groups,
    create_group,
    delete_group,
    search_group,
    join_group,
    quit_group,
    group_study,
    top_study_times
)
from .views import (
    create_task,
    update_task_date,
    delete_task,
    delete_incomplete_count_up_tasks,
    finish_task,
    get_task_info,
    get_count_up_tasks,
    start_record,
    end_record,
    delete_incomplete_count_down_tasks,
    create_count_down_task,
    get_count_down_tasks
)

# Create your tests here.

# setting test
class SettingViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='test', password='test')
        

    def test_setting(self):
        print("Testing setting function...")
        self.client.force_login(self.user)
        url = reverse('TimeTracker:setting')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        self.assertIn('user_setting', response.context)
        self.assertIn('alarm_choices', response.context)
        self.assertIn('user_profile', response.context)
        print("Test 'test_setting' passed.\n")

    #def test_setting_sync(self):
        #self.client.force_login(self.user)
        #url = reverse('TimeTracker:setting_sync_google_task')

        #data = {'isSync': True}
        #response = self.client.post(url, json.dumps(data), content_type='application/json')

        #self.assertEqual(response.status_code, 302)
        # Check if the user_setting is updated
        #updated_user_setting = UserSetting.objects.get(user=self.user)
        #self.assertEqual(updated_user_setting.syncGoogleTask, True)
        #print("Test 'test_setting_sync' passed.")

    def test_alarm_update(self):
        print("Testing alarm_update function...")
        self.client.force_login(self.user)
        url = reverse('TimeTracker:setting_update_alarm')

        data = {'alarmSelected': '/media/alarm/Marimba.mp3'}
        response = self.client.post(url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 200)
        # Check if the user_setting is updated
        updated_user_setting = UserSetting.objects.get(user=self.user)
        self.assertEqual(updated_user_setting.alarm, 'marimba')
        print("Test 'test_alarm_update' passed.\n")


# report testing
class ReportViewTestCase(TestCase):
    print("Testing report function...")
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='test', password='test')
        self.task1 = Task.objects.create(
            user=self.user,
            title='Task 1',
            category='Category 1',
            chosenDate=datetime.now().date() - timedelta(days=3),  # 模拟三天前的日期
            totalTaskTime='02:30:00',  # 模拟学习时间 2 小时 30 分钟
            totalBreakTime='01:00:00'  # 模拟休息时间 1 小时
        )
        self.task2 = Task.objects.create(
            user=self.user,
            title='Task 2',
            category='Category 2',
            chosenDate=datetime.now().date() - timedelta(days=2),  # 模拟两天前的日期
            totalTaskTime='01:00:00',  # 模拟学习时间 1 小时
            totalBreakTime='00:30:00'  # 模拟休息时间 30 分钟
        )
        
    def test_report(self):
        self.client.force_login(self.user)
        url = reverse('TimeTracker:report', kwargs={'time_range': 'week'})

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        print("Test 'test_report' passed.\n")




class GroupViewsTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_user(username='testuser', password='password')
        self.group = Group.objects.create(name='Test Group', creator=self.user)
        

    def test_get_user_groups_authenticated(self):
        print("Testing get_user_groups_authenticated function...")
        request = self.factory.get('/')
        request.user = self.user
        response = get_user_groups(request)
        self.assertEqual(response.status_code, 200)
        print("Test 'test_get_user_groups_authenticated' passed.\n")
        # Add more assertions here to test the content of the response JSON.

    def test_create_group_authenticated(self):
        print("Testing create_group_authenticated function...")
        request = self.factory.post('/', {'name': 'New Group', 'key': '123'})
        request.user = self.user
        response = create_group(request)
        self.assertEqual(response.status_code, 200)
        print("Test 'test_create_group_authenticated' passed.\n")
        # Add more assertions here to test the content of the response JSON.

    # Add similar tests for other views...

    def test_group_study(self):
        print("Testing group_study function...")
        request = self.factory.get('/')
        response = group_study(request, group_id=self.group.id)
        self.assertEqual(response.status_code, 200)
        print("Test 'test_group_study' passed.\n")
        # Add more assertions here to test the content of the response.

    def test_top_study_times(self):
        print("Testing top_study_times function...")
        request = self.factory.get('/')
        response = top_study_times(request, group_id=self.group.id)
        self.assertEqual(response.status_code, 200)
        print("Test 'test_top_study_times' passed.\n")
        # Add more assertions here to test the content of the response JSON.



class TaskViewsTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_user(username='testuser', password='password')

    def test_create_task(self):
        print("Testing create_task function...")
        request = self.factory.post('/', {'title': 'Test Task', 'taskType': 'Work', 'taskDate': '2024-03-14'})
        request.user = self.user
        response = create_task(request)
        self.assertEqual(response.status_code, 200)
        print("create_task test passed.\n")

    def test_update_task_date(self):
        print("Testing update_task_date function...")
        task = Task.objects.create(user=self.user, title='Test Task', category='Work', chosenDate='2024-03-14')
        request = self.factory.post('/', {'task_id': task.id, 'new_date': '2024-03-15'})
        request.user = self.user
        response = update_task_date(request)
        self.assertEqual(response.status_code, 200)
        print("update_task_date test passed.\n")

    def test_delete_task(self):
        print("Testing delete_task function...")
        task = Task.objects.create(user=self.user, title='Test Task', category='Work', chosenDate='2024-03-14')
        request = self.factory.post('/', {'task_id': task.id})
        request.user = self.user
        response = delete_task(request)
        self.assertEqual(response.status_code, 200)
        print("delete_task test passed.\n")

    # Add more tests for other views...

    def test_create_count_down_task(self):
        print("Testing create_count_down_task function...")
        request = self.factory.post('/', {'title': 'Test Task', 'taskType': 'Work', 'taskDate': '2024-03-14', 'taskDuration': '3600'})
        request.user = self.user
        response = create_count_down_task(request)
        self.assertEqual(response.status_code, 200)
        print("create_count_down_task test passed.\n")