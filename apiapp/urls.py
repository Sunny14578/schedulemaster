from django.contrib import admin
from django.urls import path, include
from .views import JoinApiView, AuthAPIView, Create_company

urlpatterns = [
    path('join/user/', JoinApiView.as_view()),
    path('login/', AuthAPIView.as_view()),
    path('join/company/', Create_company, name='create_company')
]
