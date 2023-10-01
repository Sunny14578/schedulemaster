from django.shortcuts import render

def home(request):
    return render(request, 'frontapp/index.html')

def login(request):
    return render(request, 'frontapp/login.html')

def schedule(request):
    return render(request, 'frontapp/schedule.html')

def table(request):
    return render(request, 'frontapp/table.html')




