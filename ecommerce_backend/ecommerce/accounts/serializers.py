from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

# ---------- LOGIN SERIALIZER ----------
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")


# ---------- BUYER REGISTRATION SERIALIZER ----------
class BuyerRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['phone', 'address', 'latitude', 'longitude']

    def update(self, instance, validated_data):
        instance.phone = validated_data.get('phone', instance.phone)
        instance.address = validated_data.get('address', instance.address)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        instance.is_buyer = True  # mark as buyer now
        instance.save()
        return instance
