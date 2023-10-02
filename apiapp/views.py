from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from .serializers import *
from rest_framework.views import APIView
from .models import User, LectureRoom
import jwt
from django.contrib.auth import authenticate
from pathlib import Path
import os, json
from django.core.exceptions import ImproperlyConfigured
# Create your views here.
BASE_DIR = Path(__file__).resolve().parent.parent

secret_file = os.path.join(BASE_DIR, 'secret.json')

with open(secret_file, 'r') as f:
    secrets = json.loads(f.read())

def get_secret(KEY, secrets=secrets):
    try:
        return secrets[KEY]
    except KeyError:
        error_msg = "Set the {} environment variable".format(KEY)
    raise ImproperlyConfigured(error_msg)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_secret("SECRET_KEY")

# 회원가입 
class JoinApiView(APIView):
    def post(self, request):
        serializer = UserSerializer(data = request.data)
        
        if serializer.is_valid():
            user = serializer.save()

            # jwt 토큰 접근
            token = TokenObtainPairSerializer.get_token(user)
            refresh_token = str(token)
            access_token = str(token.access_token)
            res = Response(
                {
                    "user": serializer.data,
                    "message": "register successs",
                    "token": {
                        "access": access_token,
                        "refresh": refresh_token,
                    },
                },
                status=status.HTTP_200_OK,
            )
            
            # jwt 토큰 => 쿠키에 저장
            res.set_cookie("access", access_token, httponly=True)
            res.set_cookie("refresh", refresh_token, httponly=True)
            
            return res
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

class AuthAPIView(APIView):
    # 유저 정보 확인
    def get(self, request):
        try:
            # access token을 decode 해서 유저 id 추출 => 유저 식별
            access = request.COOKIES['access']
            payload = jwt.decode(access, SECRET_KEY, algorithms=['HS256'])
            pk = payload.get('user_id')
            user = get_object_or_404(User, pk=pk)
            serializer = UserSerializer(instance=user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except(jwt.exceptions.ExpiredSignatureError):
            # 토큰 만료 시 토큰 갱신
            data = {'refresh': request.COOKIES.get('refresh', None)}
            serializer = TokenRefreshSerializer(data=data)
            if serializer.is_valid(raise_exception=True):
                access = serializer.data.get('access', None)
                refresh = serializer.data.get('refresh', None)
                payload = jwt.decode(access, SECRET_KEY, algorithms=['HS256'])
                pk = payload.get('user_id')
                user = get_object_or_404(User, pk=pk)
                serializer = UserSerializer(instance=user)
                res = Response(serializer.data, status=status.HTTP_200_OK)
                res.set_cookie('access', access)
                res.set_cookie('refresh', refresh)
                return res
            raise jwt.exceptions.InvalidTokenError

        except(jwt.exceptions.InvalidTokenError):
            # 사용 불가능한 토큰일 때
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    # 로그인
    def post(self, request):
    	# 유저 인증
        user = authenticate(
            email=request.data.get("email"), password=request.data.get("password")
        )
        # 이미 회원가입 된 유저일 때
        if user is not None:
            serializer = UserSerializer(user)
            # jwt 토큰 접근
            token = TokenObtainPairSerializer.get_token(user)
            refresh_token = str(token)
            access_token = str(token.access_token)
            res = Response(
                {
                    "user": serializer.data,
                    "message": 1,
                    "token": {
                        "access": access_token,
                        "refresh": refresh_token,
                    },
                },
                status=status.HTTP_200_OK,
            )
            # jwt 토큰 => 쿠키에 저장
            res.set_cookie("access", access_token, httponly=True)
            res.set_cookie("refresh", refresh_token, httponly=True)
            return res
        else:
            return Response({
                "message" : 0
            })

    # 로그아웃
    def delete(self, request):
        # 쿠키에 저장된 토큰 삭제 => 로그아웃 처리
        response = Response({
            "message": "Logout success"
            }, status=status.HTTP_202_ACCEPTED)
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        return response
    

### 기업생성

@api_view(['POST'])
def Create_Company(request):
    if request.method == 'POST':
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class TeacherAPIView(APIView):
    def get(self, request):
        teachers = User.objects.filter(role=2).order_by("name")  # 데이터베이스에서 모든 강의 데이터 가져오기
        serializer = UserSerializer(teachers, many=True)  # 시리얼라이즈된 데이터 생성
        return Response(serializer.data)  # 시리얼라이즈된 데이터를 응답으로 반환
    

class LectureAPIView(APIView):
    def get(self, request):
        lectures = LectureRoom.objects.all()  # 데이터베이스에서 모든 강의 데이터 가져오기
        serializer = LectureSerializer(lectures, many=True)  # 시리얼라이즈된 데이터 생성
        return Response(serializer.data)  # 시리얼라이즈된 데이터를 응답으로 반환

    def post(self, request):
        serializer = LectureSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": 1}, status=status.HTTP_201_CREATED)
        return Response({"message": 0}, status=status.HTTP_400_BAD_REQUEST)
