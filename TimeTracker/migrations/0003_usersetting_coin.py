# Generated by Django 5.0.1 on 2024-03-13 22:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TimeTracker', '0002_task_duration_task_chosendate_task_google_task_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='usersetting',
            name='coin',
            field=models.IntegerField(default=1),
        ),
    ]
