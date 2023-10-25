from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import datetime


year = datetime.datetime.now().year

class UserManager(BaseUserManager):
    def create_user(self, email, password, name, phone_number, role, company_id, **kwargs):

        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(
            email=email,
            name = name,
            password = password,
            phone_number = phone_number,
            role = role,
            company_id = company_id
        )
        user.set_password(password)
        user.save(using=self._db)
        return user


# 사용자(User) 모델 정의
class User(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)  # 사용자 고유 ID (자동 생성)
    email = models.EmailField(max_length=255, unique=True, null=False, blank=False)  # 이메일 주소
    name = models.CharField(max_length=255)  # 사용자 이름
    password = models.CharField(max_length=255)  # 비밀번호
    color = models.CharField(max_length=255, default="#000000") # 강사 색깔
    phone_number = models.CharField(max_length=20)   # 전화번호
    role = models.CharField(max_length=50, default=2)  # 사용자 역할 ( 예: 관리자(1), 직원(2) )
    company_id = models.ForeignKey('Company', on_delete=models.CASCADE)  # 소속 기업 ID (외래 키)

	# 헬퍼 클래스 사용
    objects = UserManager()

    USERNAME_FIELD = 'id'

    def __str__(self):
        return self.id

# 기업(Company) 모델 정의
class Company(models.Model):
    company_id = models.AutoField(primary_key=True)  # 기업 고유 ID (자동 생성)
    company_name = models.CharField(max_length=255)  # 기업 이름

    def __str__(self):
        return self.company_name

# 강의장(LectureRoom) 모델 정의
class LectureRoom(models.Model):
    room_id = models.AutoField(primary_key=True)  # 강의장 고유 ID (자동 생성)
    room_name = models.CharField(max_length=255)  # 강의장 이름
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE) # 기업 ID ( 외래 키 )

    def __str__(self):
        return str(self.room_id)

# 스케줄(Schedule) 모델 정의
# class Schedule(models.Model):
#     schedule_id = models.AutoField(primary_key=True)  # 스케줄 고유 ID (자동 생성)
#     user_id = models.ForeignKey(User, on_delete=models.CASCADE)  # 사용자 ID (외래 키, 스케줄을 소유한 사용자)
#     room_id = models.ForeignKey(LectureRoom, on_delete=models.CASCADE)  # 강의장 ID (외래 키, 스케줄이 배정된 강의장)
#     task_description = models.TextField(default="")  # 스케줄에 대한 설명 또는 작업 내용
#     year = models.IntegerField(default=year)
#     day = models.IntegerField() # 일, 월, 시간
#     month = models.IntegerField()
#     time = models.TimeField()

#     class Meta:
#         unique_together = ('year', 'day', 'month', 'time', 'user_id')

#     def __str__(self):
#         return f"Schedule {self.schedule_id} - {self.task_description}"

# cell 모델 정의
class ScheduleCell(models.Model):
    schedule_cell = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    lecture_room_id = models.ForeignKey(LectureRoom, on_delete=models.CASCADE) # 강의장 ID
    cell_content = models.TextField(default="") # 셀 내용
    border = models.CharField(default="1px solid #DDD", max_length=255) # 테두리 (예: 테두리 스타일, 두께 등)
    background_color = models.CharField(default="white", max_length=255) # 배경색
    colspan_st = models.IntegerField(default=1) # 셀 합치기 값 (예: colspan, rowspan)
    rowspan_st = models.IntegerField(default=1)
    colspan_en = models.IntegerField(default=1)
    rowspan_en = models.IntegerField(default=1)
    
    year = models.IntegerField(default=year)
    day = models.IntegerField() # 일, 월, 시간
    month = models.IntegerField()
    time = models.TimeField()
    
    memo_content = models.TextField(blank=True, null=True) # 메모 내용

    class Meta:
        unique_together = ('year', 'day', 'month', 'time', 'user_id')
