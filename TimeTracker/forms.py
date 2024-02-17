from django import forms
from django.contrib.auth.models import User


class LoginForm(forms.Form):
    email = forms.EmailField(label='EMAIL')
    password = forms.CharField(label='PASSWORD')


# reset password
class ResetPasswordForm(forms.Form):
    email = forms.EmailField(label='EMAIL')


# sign up
class SignUpForm(forms.ModelForm):
    email = forms.EmailField(label='EMAIL')

    class Meta:
        model = User
        fields = ('email',)
