from datetime import datetime, timedelta
from unittest import TestCase
from django.utils import timezone

from django.contrib.auth.models import User

from TimeTracker.forms import TaskForm, RecordForm
from TimeTracker.models import Task


class TaskFormTest(TestCase):
    def setUp(self):
        self.user = User()
        self.title = 'test'
        self.category = 'coursework'
        self.start_time = timezone.now()
        self.end_time = timezone.now() + timedelta(days=1)

    def test_allOK(self):
        form = TaskForm(data={"user": self.user,
                              "title": self.title,
                              "category": self.category,
                              "startTime": self.start_time,
                              "endTime": self.end_time})
        self.assertTrue(form.is_valid(), form.errors)

    def test_timeError(self):
        end_time = timezone.now() + timedelta(days=-1)
        form = TaskForm(data={"user": self.user,
                              "title": self.title,
                              "category": self.category,
                              "startTime": self.start_time,
                              "endTime": end_time})
        self.assertFalse(form.is_valid(), form.errors)


class RecordFormTest(TestCase):
    def setUp(self):
        self.user = User()
        self.task = Task()
        self.type = 'break'
        self.start_time = timezone.now()
        self.end_time = timezone.now() + timedelta(minutes=30)

    def test_allOK(self):
        form = RecordForm(data={"user": self.user,
                                "task": self.task,
                                "type": self.type,
                                "startTime": self.start_time,
                                "endTime": self.end_time})
        self.assertTrue(form.is_valid(), form.errors)

    def test_timeError(self):
        end_time = timezone.now() + timedelta(days=-1)
        form = RecordForm(data={"user": self.user,
                                "task": self.task,
                                "type": self.type,
                                "startTime": self.start_time,
                                "endTime": end_time})
        self.assertFalse(form.is_valid(), form.errors)
