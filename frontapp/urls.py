from django.urls import path, include
from frontapp.views import home

urlpatterns = [
    path('', home, name='home'),
]
