from django.core.files.storage import FileSystemStorage
from storages.backends.s3boto3 import S3Boto3Storage
from django.conf import settings
from django.core.files.storage import get_storage_class

# class ConditionalStorage(FileSystemStorage if not settings.IS_HEROKU_APP else S3Boto3Storage):
#     def __init__(self, *args, **kwargs):
#         if not settings.IS_HEROKU_APP:
#             super(FileSystemStorage, self).__init__(*args, **kwargs)
#         else:
#             super(S3Boto3Storage, self).__init__(*args, **kwargs)
#             self.location = settings.MEDIAFILES_LOCATION
# class ConditionalStorage:
#     def __new__(cls, *args, **kwargs):
#         if settings.IS_HEROKU_APP:
#             return S3Boto3Storage(location=settings.MEDIAFILES_LOCATION, *args, **kwargs)
#         else:
#             return FileSystemStorage(*args, **kwargs)

#     def _save(self, name, content):
#         return self.storage._save(name, content)

#     def _open(self, name, mode='rb'):
#         return self.storage._open(name, mode)

#     def url(self, name):
#         return self.storage.url(name)

#     def exists(self, name):
#         return self.storage.exists(name)

#     def delete(self, name):
#         return self.storage.delete(name)

#     def listdir(self, path):
#         return self.storage.listdir(path)

#     def size(self, name):
#         return self.storage.size(name)

#     def get_available_name(self, name, max_length=None):
#         return self.storage.get_available_name(name, max_length)

class MediaStorage(S3Boto3Storage):
    location = 'media'
    file_overwrite = False
    default_acl = 'private'  

class AvatarStorage(S3Boto3Storage):
    location = 'media/avatar_images'
    file_overwrite = False
    default_acl = 'private'

class AlarmSoundStorage(S3Boto3Storage):
    location = 'media/alarm_sounds'
    file_overwrite = False
    default_acl = 'private'
