from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth import views as auth_views
from django.contrib import messages
from TimeTracker.forms import LoginForm, ResetPasswordForm, SignUpForm


def user_login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)

        if form.is_valid():
            # Use cleaned_data to access the validated form data
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            # Authenticate the user
            user = authenticate(request,username = email, password= password)
            print(f"Authenticate result: {user}")
            list(messages.get_messages(request))
            
            # find the correct user by user email 
            try:
                user = User.objects.get(email=email)
                username = user.username
            except User.DoesNotExist:
                user = None

            # if user is found, user the username to login
            if user is not None:
                user = authenticate(request, username=username, password=password)
                print(f"Authenticate result: {user}")
            
                if user:
                    print("User is authenticated")
                    if user.is_active:
                        login(request, user)
                        # todo: need homepage
                        return redirect(reverse('homepage'))
                    else:
                        messages.error(request, "Your account is disabled.")
                else:                
                    messages.error(request, "Invalid login details supplied.")
            else:
                messages.error(request, "No user found with that email address.")
        else:          
            messages.error(request, "Invalid form submission.")
    else:
        form = LoginForm()  # Provide an instance of 'LoginForm' when the method is GET
    # Render the login template with the form
    return render(request, 'TimeTracker/user_login_page.html', {'form': form})


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

