# Generated by Django 5.0.1 on 2024-02-28 04:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TimeTracker', '0003_userprofile_study_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='study_time',
            field=models.TimeField(default='00:00:00'),
        ),
    ]