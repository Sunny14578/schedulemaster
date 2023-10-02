from django.contrib import admin
from django.urls import path, include
from .views import JoinApiView, AuthAPIView, LectureAPIView, Create_Company, TeacherAPIView

urlpatterns = [
    path('join/user/', JoinApiView.as_view()),
    path('teacher/', TeacherAPIView.as_view()),
    path('login/', AuthAPIView.as_view()),
    path('logout/', AuthAPIView.as_view()),
    path('join/company/', Create_Company, name='Create_Company'),
    path('lecture/', LectureAPIView.as_view(), name='Lecture_Room')
]
