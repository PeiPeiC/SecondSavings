from django import forms

from TimeTracker.models import Task, Record, UserProfile


class UserProfileForm(forms.ModelForm):
    class Mate:
        model = UserProfile
        fields = ('nickName', 'picture',)


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
