from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib import messages
from TimeTracker.forms import LoginForm, ResetPasswordForm, SignUpForm
from TimeTracker.models import Group, UserProfile
from django.views.decorators.csrf import csrf_exempt

from TimeTracker.forms import UserProfileForm


def main(request):
    return render(request, 'TimeTracker/main.html')


#Group study funtion
def group_study(request):                                                       
    group_instance = Group.objects.first()  
    members = group_instance.members.all()
    context = {
        'group': group_instance,
        'members': members
    }
    return render(request, 'TimeTracker/group_study.html', context)

#Study Time Ranking Popup 
def top_study_times(request):                                                                       
    top_users = UserProfile.objects.all().order_by('-study_time')[:3]
    data = {
        'top_users': [
            {'username': profile.user.username, 'study_time': profile.study_time}
            for profile in top_users
        ]
    }
    return JsonResponse(data)
@login_required
def profile(request):
    user = request.user
    return render(request, 'TimeTracker/profile.html', {'user': user})


@login_required
@csrf_exempt
def profile_update(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.add_message(request, messages.SUCCESS, 'Update Successfully')
            return redirect('TimeTracker:profile')
    else:
        form = UserProfileForm()

    return render(request, 'TimeTracker/profile_update.html', context={'form': form})
