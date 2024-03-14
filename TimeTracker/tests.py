import json
from datetime import datetime, timedelta

from django.contrib.auth.models import User
from django.test import TestCase, Client
from django.urls import reverse

from TimeTracker.models import UserSetting, UserProfile, Task


# Create your tests here.

# setting test
class SettingViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='test', password='test')

    def test_setting(self):
        self.client.force_login(self.user)
        url = reverse('TimeTracker:setting')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        self.assertIn('user_setting', response.context)
        self.assertIn('alarm_choices', response.context)
        self.assertIn('user_profile', response.context)

    def test_setting_sync(self):
        self.client.force_login(self.user)
        url = reverse('TimeTracker:setting_sync_google_task')

        data = {'isSync': True}
        response = self.client.post(url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 302)
        # Check if the user_setting is updated
        updated_user_setting = UserSetting.objects.get(user=self.user)
        self.assertEqual(updated_user_setting.syncGoogleTask, True)

    def test_alarm_update(self):
        self.client.force_login(self.user)
        url = reverse('TimeTracker:setting_update_alarm')

        data = {'alarmSelected': '/media/alarm/Marimba.mp3'}
        response = self.client.post(url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 200)
        # Check if the user_setting is updated
        updated_user_setting = UserSetting.objects.get(user=self.user)
        self.assertEqual(updated_user_setting.alarm, 'marimba')


# report testing
class ReportViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='test', password='test')
        self.task1 = Task.objects.create(
            user=self.user,
            title='Task 1',
            category='Category 1',
            chosenDate=datetime.now().date() - timedelta(days=3),  # Simulate the date three days ago
            totalTaskTime='02:30:00',  # Simulate study time of 2 hours and 30 minutes
            totalBreakTime='01:00:00'  # Simulate break time of 1 hour
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