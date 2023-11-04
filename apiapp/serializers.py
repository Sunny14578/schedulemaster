from rest_framework import serializers
from .models import User, Company, LectureRoom, ScheduleCell

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class LectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = LectureRoom
        fields = ('room_id', 'room_name', 'company_id')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        user = User.objects.create_user(
            email = validated_data['email'],
            name = validated_data['name'],
            password = validated_data['password'],
            phone_number = validated_data['phone_number'],
            color = "#000000",
            role = validated_data['role'],
            company_id = validated_data['company_id']
        )
        return user
    
# class UserScheduleSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Schedule
#         fields = '__all__'  # 모든 필드를 직렬화
    
class ScheduleSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(source='user_id.id', read_only=True)  # 'user_id' 필드 값을 'User' 객체의 'id'로 설정

    class Meta:
        model = ScheduleCell
        fields = '__all__'