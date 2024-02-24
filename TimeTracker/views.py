from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt

from TimeTracker.forms import UserProfileForm


def main(request):
    return render(request, 'TimeTracker/main.html')


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
