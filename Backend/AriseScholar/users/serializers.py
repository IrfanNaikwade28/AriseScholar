# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password', 'study_goal']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            study_goal=validated_data['study_goal'],
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid email or password")
        data['user'] = user
        return data

class UserSerializer(serializers.ModelSerializer):
    badges = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'xp', 'level', 'streak', 'badges']

    def get_badges(self, obj):
        badges = []
        if obj.level >= 1:
            badges.append("First Quiz")
        if obj.streak >= 7:
            badges.append("7 Day Streak")
        return badges