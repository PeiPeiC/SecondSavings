from django.utils import timezone

from django import forms
from django.contrib.auth.models import User

from TimeTracker.models import UserProfile, Task, Record


class LoginForm(forms.Form):
    email = forms.EmailField(label='Email', help_text='Email address', required=True)
    password = forms.CharField(label='Password', widget=forms.PasswordInput, help_text='Enter your password',
                               required=True)


# reset password
class ResetPasswordForm(forms.Form):
    email = forms.EmailField(label='Email', required=True)


# sign up
class SignUpForm(forms.ModelForm):
    email = forms.EmailField(label='Email', required=True)

    class Meta:
        model = User
        fields = ('email',)


# used for modify user's profile
class UserProfileForm(forms.ModelForm):
    class Mate:
        model = UserProfile
        fields = ('picture',)


# for creating task
class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ('title', 'category', 'status', 'badge', 'startTime', 'endTime')

        labels = {
            "startTime": "start time",
            "endTime": "end time",
        }

    def clean(self):
        # check startTime and endTime
        start_time = self.cleaned_data.get('startTime')
        end_time = self.cleaned_data.get('endTime')

        if start_time and end_time:
            if start_time >= end_time:
                self.add_error('endTime', ValueError)

        return self.cleaned_data


class RecordForm(forms.ModelForm):
    class Meta:
        model = Record
        fields = ('type', 'startTime', 'endTime')
        labels = {
            "startTime": "start time",
            "endTime": "end time",
        }

    def clean(self):
        # check startTime and endTime
        start_time = self.cleaned_data.get('startTime')
        end_time = self.cleaned_data.get('endTime')

        if start_time and end_time:
            if start_time >= end_time:
                self.add_error('endTime', ValueError)

        return self.cleaned_data
