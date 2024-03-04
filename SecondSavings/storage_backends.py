from storages.backends.s3boto3 import S3Boto3Storage

class MediaStorage(S3Boto3Storage):
    location = 'media'
    file_overwrite = False
    default_acl = 'private'  # 或根据需要设置为其他权限

class AvatarStorage(S3Boto3Storage):
    location = 'media/avatar_images'
    file_overwrite = False
    default_acl = 'public-read'

class AlarmSoundStorage(S3Boto3Storage):
    location = 'media/alarm_sounds'
    file_overwrite = False
    default_acl = 'public-read'
