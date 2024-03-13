# Generated by Django 5.0.1 on 2024-03-13 20:03

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TimeTracker', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='Duration',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='task',
            name='chosenDate',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='task',
            name='google_task_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='task',
            name='google_tasklist_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='task',
            name='isCompleted',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='task',
            name='isCountDown',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='task',
            name='totalBreakTime',
            field=models.TimeField(default='00:00:00'),
        ),
        migrations.AddField(
            model_name='task',
            name='totalSeconds',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='task',
            name='totalTaskTime',
            field=models.TimeField(default='00:00:00'),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='life_time',
            field=models.TimeField(default='00:00:00'),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='study_time',
            field=models.TimeField(default='00:00:00'),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='work_time',
            field=models.TimeField(default='00:00:00'),
        ),
        migrations.AlterField(
            model_name='task',
            name='endTime',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='task',
            name='startTime',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('key', models.CharField(default='00000000', max_length=64)),
                ('creator', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('members', models.ManyToManyField(related_name='group_memberships', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserSetting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('alarm', models.CharField(choices=[('default', '/media/alarm/default.mp3'), ('marimba', '/media/alarm/Marimba.mp3'), ('harp', '/media/alarm/Harp.mp3')], default='default', max_length=10)),
                ('syncGoogleTask', models.BooleanField(default=False)),
                ('google_access_token', models.CharField(blank=True, max_length=255, null=True)),
                ('google_refresh_token', models.CharField(blank=True, max_length=255, null=True)),
                ('user', models.OneToOneField(default=None, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
