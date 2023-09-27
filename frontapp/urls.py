from django.urls import path, include
from frontapp.views import home, login, schedule

urlpatterns = [
    path('', home, name='home'),
    path('login/', login, name='login_page'),
    path('schedule/', schedule, name='schedule'),
]
