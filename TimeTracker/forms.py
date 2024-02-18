from django import forms
from django.contrib.auth.models import User


class LoginForm(forms.Form):
    email = forms.EmailField(label='Email', help_text='Email address')
    password = forms.CharField(label='Password', widget=forms.PasswordInput, help_text='Enter your password')


# reset password
class ResetPasswordForm(forms.Form):
    email = forms.EmailField(label='Email')


# sign up
class SignUpForm(forms.ModelForm):
    email = forms.EmailField(label='Email')

    class Meta:
        model = User
        fields = ('email',)
