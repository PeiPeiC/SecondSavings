from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User

class UserLoginTestCase(TestCase):
    def setUp(self):
        self.username = "testuser"
        self.password = "testpassword"
        User.objects.create_user(self.username, email='test@example.com', password=self.password)

    def test_valid_login(self):
        response = self.client.post(reverse('user_login'), {'email': 'test@example.com', 'password': self.password})
        self.assertRedirects(response, reverse('homepage'))  # Adjust the 'homepage' to your target URL

    def test_invalid_login(self):
        response = self.client.post(reverse('user_login'), {'email': 'test@example.com', 'password': 'wrong'})
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'TimeTracker/user_login_page.html')  # Adjust to your login template
        self.assertContains(response, "Invalid login details supplied")
