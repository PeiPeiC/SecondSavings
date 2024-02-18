from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth import views as auth_views

from TimeTracker.forms import LoginForm, ResetPasswordForm, SignUpForm


def user_login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)

        if form.is_valid():
            user = authenticate(email=form.email, password=form.password)

            if user:
                if user.is_active:
                    login(request, user)
                    # todo: need homepage
                    return redirect(reverse('homepage'))
                else:
                    return HttpResponse("Your account is disabled.")
            else:
                print(f'Invalid login details: {form.email}, {form.password}')
                return HttpResponse("Invalid login details supplied")

    else:
        # todo: need login page
        return render(request, 'login')


def user_reset(request):
    if request.method == 'POST':
        form = ResetPasswordForm(request.POST)

        if form.is_valid():
            try:
                user = User.objects.get(email=form.email)
                # todo send email
                # provided by django
                return auth_views.PasswordResetView.as_view()(request)
            except User.DoesNotExist:
                print(f'Invalid email details: {form.email}')
                return HttpResponse('Invalid email supplied')
    else:
        # todo need reset page
        return render(request, 'reset')


def user_signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)

        if form.is_valid():
            user = form.save()
            # todo send email
            return redirect(reverse('homepage'))  # todo: need homepage

    else:
        form = SignUpForm()

    # todo need signup page
    return render(request, 'sign up', {'form': form})

