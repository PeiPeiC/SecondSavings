# Generated by Django 5.0.1 on 2024-03-04 05:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TimeTracker', '0006_task_totalseconds'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='chosenDate',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='task',
            name='isCompleted',
            field=models.BooleanField(default=False),
        ),
    ]
