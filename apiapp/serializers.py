from rest_framework import serializers
from .models import User, Company, LectureRoom, ScheduleCell

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class LectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = LectureRoom
        fields = '__all__'

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
            color = validated_data['color'],
            role = validated_data['role'],
            company_id = validated_data['company_id']
        )
        return user
    
class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleCell
        fields = '__all__'