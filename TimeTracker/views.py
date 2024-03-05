import base64
import json
import random
import string
from io import BytesIO

from PIL import Image
from django.contrib.auth.decorators import login_required
from django.core.files.base import ContentFile
from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt

from TimeTracker.models import UserProfile
import logging

import boto3
from django.conf import settings
from botocore.exceptions import NoCredentialsError

logger = logging.getLogger('django')

def main(request):
    return render(request, 'TimeTracker/main.html')


@login_required
def profile(request):
    user_profile, created = UserProfile.objects.get_or_create(user=request.user) #因為get_or_create它要么獲取現有的異常塊UserProfile，要么創建一個新的異常塊（如果它不存在）。UserProfile.DoesNotExist因此，可以刪除的異常處理。
        # return redirect('/accounts/login/')
        # 检查 user_profile.avatar 是不是字符串类型
    if isinstance(user_profile.avatar, str):
        print("user_profile.avatar is a string:", user_profile.avatar)
        # 这里可以设置 user_profile.avatar 为 None 或者正确处理为期望的文件/图像对象
        # 例如: user_profile.avatar = None 或者适当的默认图像
        user_profile.avatar = None
    else:
        print("Avatar field value:", user_profile.avatar)
        print("Avatar field type:", type(user_profile.avatar))
    return render(request, 'TimeTracker/userInfo.html', {'user_profile': user_profile})


@login_required
@csrf_exempt
def profile_update(request):
    if request.method == 'POST':
        user_profile, created = UserProfile.objects.get_or_create(user=request.user)
        form_data = request.POST
        nick_name = form_data.get('nickName')

        user_profile.nickName = nick_name
        user_profile.save()

        messages.add_message(request, messages.SUCCESS, 'Update Successfully')
        return redirect('TimeTracker:profile')
    else:
        user_profile = UserProfile()

    return render(request, 'TimeTracker/userInfo.html', context={'user_profile': user_profile, 'user': request.user})



# @login_required
# def avatar_update(request):
#     if request.method == "POST":
#         user_profile, created = UserProfile.objects.get_or_create(user=request.user)
#         data = json.loads(request.body)
#         avatar_data = data.get('avatarData', None)

#         if avatar_data:
#             file_data = avatar_data.split(',')[1]  # remove data:image/png;base64,
#             image_data_decoded = base64.b64decode(file_data)
#             rand_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
#             file_name = f'{request.user.username}_{rand_str}.jpg'

#             if settings.IS_HEROKU_APP:
#                 # Heroku环境下的逻辑
#                 s3 = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
#                                   aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
#                 try:
#                     s3.put_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=f'media/{file_name}',
#                                   Body=image_data_decoded, ContentType='image/jpeg', ACL=settings.AWS_DEFAULT_ACL)
#                     user_profile.avatar = f'{settings.AWS_S3_CUSTOM_DOMAIN}/media/{file_name}'
#                     user_profile.save()
#                     messages.success(request, 'Avatar updated to S3 successfully')
#                 except NoCredentialsError:
#                     messages.error(request, 'Error uploading file to S3')
#             else:
#                 # 非Heroku环境下的逻辑
#                 image = Image.open(BytesIO(image_data_decoded))
#                 image_io = BytesIO()
#                 image.save(image_io, format='JPEG')
#                 if user_profile.avatar:
#                     user_profile.avatar.delete()  # delete the old one
#                 user_profile.avatar.save(file_name, ContentFile(image_io.getvalue()), save=False)
#                 logger.info(f'New avatar saved: {file_name} for user {request.user.username}')
#                 user_profile.save()

#             return redirect('TimeTracker:profile')
#         else:
#             messages.error(request, 'Invalid Image')

#     return render(request, 'TimeTracker/userInfo.html', context={'user_profile': user_profile})
@login_required
def avatar_update(request):
    if request.method == "POST":
        user_profile, created = UserProfile.objects.get_or_create(user=request.user)
        data = json.loads(request.body)
        avatar_data = data.get('avatarData', None)

        if avatar_data:
            # Decode the base64 image data
            file_data = avatar_data.split(',')[1]  # remove data:image/png;base64,
            image_data_decoded = base64.b64decode(file_data)
            image = Image.open(BytesIO(image_data_decoded))
            image_io = BytesIO()
            image.save(image_io, format='JPEG', quality=85)
            image_content_file = ContentFile(image_io.getvalue())

            # Create a file name
            rand_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
            file_name = f'{request.user.username}_{rand_str}.jpg'

            # Save the new avatar in the UserProfile model
            if user_profile.avatar:
                user_profile.avatar.delete()  # delete the old one
            user_profile.avatar.save(file_name, image_content_file)

            messages.success(request, 'Avatar updated successfully')
            return redirect('TimeTracker:profile')
        else:
            messages.error(request, 'Invalid Image')
            # Print the avatar data and type for debugging
    print("Avatar field value:", user_profile.avatar)
    print("Avatar field type:", type(user_profile.avatar))
    return render(request, 'TimeTracker/userInfo.html', context={'user_profile': user_profile})

def report(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/report.html')


def table(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/Group.html')


def music(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/music.html')


def coin(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/coin.html')


def setting(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/setting.html')


def badges(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/badges.html')


@login_required
def login_main(request):
    return render(request, 'TimeTracker/login_main.html')
