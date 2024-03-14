import json
from datetime import datetime, timedelta

from django.contrib.auth.models import User
from django.test import TestCase, Client, RequestFactory
from django.urls import reverse

from TimeTracker.models import UserSetting, UserProfile, Task, Group, Record
from .views import (
    get_user_groups,
    create_group,
    delete_group,
    quit_group,
    group_study,
    top_study_times,
    create_task,
    update_task_date,
    delete_task,
    finish_task,
    get_task_info,
    start_record,
    end_record,
    delete_incomplete_count_down_tasks,
    create_count_down_task,
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
            chosenDate=datetime.now().date() - timedelta(days=3),  # Simulate the date three days ago
            totalTaskTime='02:30:00',  # Simulated study time 2 hours 30 minutes
            totalBreakTime='01:00:00'  # Simulated rest time 1 hour
        )
        self.task2 = Task.objects.create(
            user=self.user,
            title='Task 2',
            category='Category 2',
            chosenDate=datetime.now().date() - timedelta(days=2),  # Simulate the date two days ago
            totalTaskTime='01:00:00',  # Simulate study time of 1 hour
            totalBreakTime='00:30:00'  # Simulate break time of 30 minutes
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
      

    def test_create_group_authenticated(self):
        print("Testing create_group_authenticated function...")
        request = self.factory.post('/', {'name': 'New Group', 'key': '123'})
        request.user = self.user
        response = create_group(request)
        self.assertEqual(response.status_code, 200)
        print("Test 'test_create_group_authenticated' passed.\n")
        

    def test_group_study(self):
        print("Testing group_study function...")
        request = self.factory.get('/')
        response = group_study(request, group_id=self.group.id)
        self.assertEqual(response.status_code, 200)
        print("Test 'test_group_study' passed.\n")
       

    def test_top_study_times(self):
        print("Testing top_study_times function...")
        request = self.factory.get('/')
        response = top_study_times(request, group_id=self.group.id)
        self.assertEqual(response.status_code, 200)
        print("Test 'test_top_study_times' passed.\n")
        
    def test_delete_group(self):
        print("Testing delete_group function...")
        request = self.factory.post('/')
        request.user = self.user
        response = delete_group(request, group_id=self.group.id)
        self.assertEqual(response.status_code, 200)
        print("delete_group test passed.")


    def test_quit_group(self):
        print("Testing quit_group function...")
        request = self.factory.post('/')
        request.user = self.user
        response = quit_group(request, group_id=self.group.id)
        self.assertEqual(response.status_code, 200)
        print("quit_group test passed.")



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
        print("create_task test passed.")

    def test_update_task_date(self):
        print("Testing update_task_date function...")
        task = Task.objects.create(user=self.user, title='Test Task', category='Work', chosenDate='2024-03-14')
        request = self.factory.post('/', {'task_id': task.id, 'new_date': '2024-03-15'})
        request.user = self.user
        response = update_task_date(request)
        self.assertEqual(response.status_code, 200)
        print("update_task_date test passed.")

    def test_delete_task(self):
        print("Testing delete_task function...")
        task = Task.objects.create(user=self.user, title='Test Task', category='Work', chosenDate='2024-03-14')
        request = self.factory.post('/', {'task_id': task.id})
        request.user = self.user
        response = delete_task(request)
        self.assertEqual(response.status_code, 200)
        print("delete_task test passed.")

    def test_finish_task(self):
        print("Testing finish_task function...")
        task = Task.objects.create(user=self.user, title='Test Task', category='Work', chosenDate='2024-03-14')
        request = self.factory.post('/', {'taskId': task.id, 'isCompleted': 'true', 'endTime': '2024-03-14T12:00:00'})
        request.user = self.user
        response = finish_task(request)
        self.assertEqual(response.status_code, 200)
        print("finish_task test passed.")

    def test_get_task_info(self):
        print("Testing get_task_info function...")
        task = Task.objects.create(user=self.user, title='Test Task', category='Work', chosenDate='2024-03-14')
        request = self.factory.get('/', {'taskId': task.id})
        request.user = self.user
        response = get_task_info(request)
        self.assertEqual(response.status_code, 200)
        print("get_task_info test passed.")

    

    def test_create_count_down_task(self):
        print("Testing create_count_down_task function...")
        request = self.factory.post('/', {'title': 'Test Task', 'taskType': 'Work', 'taskDate': '2024-03-14', 'taskDuration': '3600'})
        request.user = self.user
        response = create_count_down_task(request)
        self.assertEqual(response.status_code, 200)
        print("create_count_down_task test passed.")

    def test_start_record(self):
        print("Testing start_record function...")
        task = Task.objects.create(user=self.user, title='Test Task', category='Work', chosenDate='2024-03-14')
        request = self.factory.post('/', {'taskId': task.id, 'recordType': 'task'})
        request.user = self.user
        response = start_record(request)
        self.assertEqual(response.status_code, 200)
        print("start_record test passed.")

    def test_end_record(self):
        print("Testing end_record function...")
        task = Task.objects.create(user=self.user, title='Test Task', category='Work', chosenDate='2024-03-14')
        record = Record.objects.create(task=task, user=self.user, type='task')
        request = self.factory.post('/', {'recordId': record.id})
        request.user = self.user
        response = end_record(request)
        self.assertEqual(response.status_code, 200)
        print("end_record test passed.")

    def test_delete_incomplete_count_down_tasks(self):
        print("Testing delete_incomplete_count_down_tasks function...")
        task = Task.objects.create(user=self.user, title='Test Task', category='Work', chosenDate='2024-03-14', isCountDown=True)
        request = self.factory.post('/')
        request.user = self.user
        response = delete_incomplete_count_down_tasks(request)
        self.assertEqual(response.status_code, 200)
        print("delete_incomplete_count_down_tasks test passed.")

    