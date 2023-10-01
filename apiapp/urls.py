from django.contrib import admin
from django.urls import path, include
from .views import JoinApiView, AuthAPIView, Create_Company, LectureAPIView

urlpatterns = [
    path('join/user/', JoinApiView.as_view()),
    path('login/', AuthAPIView.as_view()),
    path('logout/', AuthAPIView.as_view()),
    path('join/company/', Create_Company, name='create_company'),
    path('lecture/', LectureAPIView.as_view(), name='create_Lecture')
]
