from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from TimeTracker.models import UserProfile


# When create a new User, create a related UserProfile
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
<<<<<<< HEAD

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()
=======
>>>>>>> 579dd95 (modify models)
