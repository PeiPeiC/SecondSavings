from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def main(request):
    return render(request, "main.html")
    # return HttpResponse("Hello, world. You're at the SecondSavings main page.")
