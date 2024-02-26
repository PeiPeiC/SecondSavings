from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt

from TimeTracker.forms import UserProfileForm
from TimeTracker.models import UserProfile


def main(request):
    return render(request, 'TimeTracker/main.html')


@login_required
def profile(request, username):
    try:
        user = User.objects.get(username=username)
        user_profile = UserProfile.objects.get(user=user)
    except UserProfile.DoesNotExist:
        messages.error(request, 'Invalid Login')
        user_profile = UserProfile()
        # return redirect('/accounts/login/')
    return render(request, 'TimeTracker/userinfo.html', {'user_profile': user_profile})


@login_required
@csrf_exempt
def profile_update(request, username):
    if request.method == 'POST':
        form = UserProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.add_message(request, messages.SUCCESS, 'Update Successfully')
            return redirect('TimeTracker:profile')
    else:
        form = UserProfileForm()

    return render(request, 'TimeTracker/profile_update.html', context={'form': form})


def index(request):
    if request.method == 'GET':
        return render(request, 'TimeTracker/userInfo.html')


def line_chart(request):
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
