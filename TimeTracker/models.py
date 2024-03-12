from datetime import datetime, timedelta

from django.utils import timezone

from django.contrib.auth.models import User, AbstractUser, Group, Permission

from django.db import models
from django.template.defaultfilters import slugify

from SecondSavings import settings
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill


class UserProfile(models.Model):
    NICK_NAME_MAX_LENGTH = 30

    user = models.OneToOneField(User, on_delete=models.CASCADE, default=None)
    nickName = models.CharField(max_length=NICK_NAME_MAX_LENGTH)

    study_time = models.TimeField(default="00:00:00")  # learning time
    work_time = models.TimeField(default="00:00:00")  # learning time
    life_time = models.TimeField(default="00:00:00")  # learning time
    avatar = ProcessedImageField(upload_to='avatar_images',
                                 processors=[ResizeToFill(100, 100)],
                                 format='JPEG',
                                 options={'quality': 95})

    def save(self, *args, **kwargs):
        self.slug = slugify(self.user.username)
        if not self.nickName:
            self.nickName = self.user.username
        super(UserProfile, self).save(*args, **kwargs)

    def __str__(self):
        return 'nickname:' + self.nickName + ' avatar:' + self.avatar.url


class Group(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(User, related_name='group_memberships')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    key = models.CharField(max_length=64, default='00000000')

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
    totalSeconds = models.IntegerField(default=0)
    badge = models.ImageField(upload_to='badge_images', blank=True)
    startTime = models.DateTimeField(null=True, blank=True)
    endTime = models.DateTimeField(null=True, blank=True)
    isCompleted = models.BooleanField(default=False)  # 新增字段标记任务是否完成
    chosenDate = models.DateField(null=True, blank=True)  # 新增字段存储用户选择的日期
    totalTaskTime = models.TimeField(default="00:00:00")  # 新增总学习时间
    totalBreakTime = models.TimeField(default="00:00:00")  # 新增总休息时间

    def __str__(self):
        return f"{self.title}, date:{self.chosenDate}"

    def total_seconds(self):
        # 将 TimeField 转换为 timedelta
        task_timedelta_value = datetime.strptime(str(self.totalTaskTime), '%H:%M:%S') - datetime.strptime('00:00:00',
                                                                                                     '%H:%M:%S')
        break_timedelta_value = datetime.strptime(str(self.totalBreakTime), '%H:%M:%S') - datetime.strptime('00:00:00',
                                                                                                          '%H:%M:%S')

        # 计算总秒数
        total_task_seconds = task_timedelta_value.total_seconds()
        total_break_seconds = break_timedelta_value.total_seconds()

        return total_task_seconds,total_break_seconds


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


class UserSetting(models.Model):
    ALARM_MAX_LENGTH = 10
    ALARM_CHOICES = [
        ('default', f"{settings.MEDIA_URL}alarm/default.mp3"),
        ('marimba', f"{settings.MEDIA_URL}alarm/Marimba.mp3"),
        ('harp', f"{settings.MEDIA_URL}alarm/Harp.mp3")
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, default=None)
    alarm = models.CharField(choices=ALARM_CHOICES, default='default', max_length=ALARM_MAX_LENGTH)
    syncGoogleTask = models.BooleanField(default=False)

    def __str__(self):
        return 'user:' + self.user.username + ' alarm:' + self.alarm

    def get_url(self):
        for key, value in self.ALARM_CHOICES:
            if self.alarm == key:
                return value
        return None  # Return None if the key is not found

    def get_alarm(self, url):
        for key, value in self.ALARM_CHOICES:
            if url == value:
                return key
        return None


class ReportItem:
    def __init__(self, label, seconds):
        self.label = label
        self.seconds = seconds

    def __str__(self):
        return f"label={self.label}, seconds={self.seconds}"
