import json

from django.contrib.auth.models import User
from django.test import TestCase, Client
from django.urls import reverse

from TimeTracker.models import UserSetting, UserProfile


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