from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from .serializers import *
from rest_framework.views import APIView
from .models import User, LectureRoom, ScheduleCell
import jwt
from django.contrib.auth import authenticate
from pathlib import Path
import os, json
from django.core.exceptions import ImproperlyConfigured
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
import json
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
        print(serializer)
        
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
        print(request.data.get("email"), request.data.get("password"))
        user = authenticate(
            email=request.data.get("email"), password=request.data.get("password")
        )
        print(user, "확인해보자")
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
            return Response({"message": 1, "data" : serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"message": 0}, status=status.HTTP_400_BAD_REQUEST)


class ScheduleAPIView(APIView):
    def get(self, request):
        cells = ScheduleCell.objects.all()
        serializer = ScheduleSerializer(cells, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        data = request.data  # 요청 데이터 가져오기
        lecture_room_ids = [item['lecture_room_id'] for item in data]
        
        cells = ScheduleCell.objects.select_related('lecture_room_id').filter(lecture_room_id__in=lecture_room_ids)
        cell_lookup = {cell.lecture_room_id.room_id: cell for cell in cells}

        if cell_lookup:
            datas = []

            for item in data:
                room_id = item['lecture_room_id']
                cell = cell_lookup.get(room_id)
                item['lecture_room_id'] = cell.lecture_room_id
                datas.append(ScheduleCell(**item))
                
            ScheduleCell.objects.bulk_create(datas)
            return Response({"message": 1}, status=status.HTTP_201_CREATED)
        else:
            lecture_rooms = LectureRoom.objects.all()
            last_room = lecture_rooms.last()
            last_room_id = last_room.room_id
            final_last_room = LectureRoom.objects.get(room_id=last_room_id)
            datas = []

            for item in data:
                item['lecture_room_id'] = final_last_room
                datas.append(ScheduleCell(**item))
                
            ScheduleCell.objects.bulk_create(datas)
            return Response({"message": 1}, status=status.HTTP_201_CREATED)
            
    @transaction.atomic
    def put(self, request):
        try:
            data = request.data  
            pks_to_update = [item["pk"] for item in data]
            
            schedule_cells_to_update = ScheduleCell.objects.filter(pk__in=pks_to_update)
            user_data = User.objects.values('color', 'id')
        
            for item, cell in zip(data, schedule_cells_to_update):
                matching_ids = [i['id'] for i in user_data if i['color'] == rgb_to_hex(item["background_color"])]
              
                if matching_ids:
                    user = User.objects.get(id=matching_ids[0])
                    cell.user_id = user
                else:
                    cell.user_id = None

                cell.cell_content = item["cell_content"]
                cell.border = item["border"]
                cell.background_color = item["background_color"]

            ScheduleCell.objects.bulk_update(schedule_cells_to_update, ["cell_content", "border", "background_color", "user_id"])
            return Response({"message": 1}, status=status.HTTP_200_OK)
        
        except Exception as e:
            error_message = str(e)
            return Response({"message": 0, "error":error_message}, status=status.HTTP_200_OK)
       

        
    def delete(self, request, pk):
        try:
            schedule_cell = ScheduleCell.objects.get(pk=pk)
            schedule_cell.delete()
            return Response({"message": "ScheduleCell deleted"}, status=204)
        except ScheduleCell.DoesNotExist:
            return Response({"error": "ScheduleCell does not exist"}, status=404)


def rgb_to_hex(rgb):
    # RGB 값을 공백을 기준으로 나누어 리스트로 만듭니다.
  
    rgb = rgb[4:-1].split(', ')
 
    # RGB 값은 문자열로 되어 있으므로 정수로 변환합니다.
    try:
        r, g, b = [int(channel) for channel in rgb]
        
        # RGB 값을 HEX 형식으로 변환합니다.
        hex_color = "#{:02X}{:02X}{:02X}".format(r, g, b)
        return hex_color
    except:
        return None
    
class ScheduleByUserAPIView(APIView):
    def get(self, request, user_id):
        cells = ScheduleCell.objects.filter(user_id=user_id)
        serializer = ScheduleSerializer(cells, many=True)
        return Response(serializer.data)