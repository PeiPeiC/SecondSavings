from django.utils import timezone

from django.contrib.auth.models import User
from django.db import models

from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    picture = ProcessedImageField(upload_to='profile_images',
                                  processors=[ResizeToFill(100, 100)],
                                  format='JPEG',
                                  options={'quality': 95})
    study_time = models.TimeField(default="00:00:00")  # learning time

    def __str__(self):
        return self.user.username

class Group(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(User, related_name='group_memberships')

    def __str__(self):
        return self.name
    

class Task(models.Model):
    TITLE_MAX_LENGTH = 120
    CATEGORY_MAX_LENGTH = 50

    # when user is deleted, all his tasks should be deleted
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=TITLE_MAX_LENGTH)
    category = models.CharField(max_length=CATEGORY_MAX_LENGTH)
    status = models.CharField(max_length=CATEGORY_MAX_LENGTH, default='pending', blank=True)
    badge = models.ImageField(upload_to='badge_images', blank=True)
    startTime = models.DateTimeField()
    endTime = models.DateTimeField()

    def __str__(self):
        return self.title


RECORD_TYPE_CHOICES = (('break', 'BREAK'), ('task', 'TASK'))


class Record(models.Model):
    TYPE_MAX_LENGTH = 5

    # when user is deleted, all his records should be deleted
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # break or study
    type = models.CharField(max_length=TYPE_MAX_LENGTH, choices=RECORD_TYPE_CHOICES, default='task')
    # when task is deleted, all its records should be deleted
    task = models.ForeignKey(Task, on_delete=models.CASCADE, blank=True, null=True)
    startTime = models.DateTimeField(default=timezone.now, blank=True)
    endTime = models.DateTimeField(blank=True, null=True)