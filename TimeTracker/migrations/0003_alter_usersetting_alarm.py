# Generated by Django 5.0.1 on 2024-03-05 16:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TimeTracker', '0002_usersetting'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usersetting',
            name='alarm',
            field=models.CharField(choices=[('default', '/Users/ruby/Documents/UofG/IT /Workspace/SecondSavings/media/alarm/default.mp3'), ('marimba', '/Users/ruby/Documents/UofG/IT /Workspace/SecondSavings/media/alarm/Marimba.mp3'), ('harp', '/Users/ruby/Documents/UofG/IT /Workspace/SecondSavings/media/alarm/Harp.mp3')], default='default', max_length=10),
        ),
    ]
