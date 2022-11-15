from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Tip
User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email','username')

class TipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tip
        fields = ('message','icon')

class UserSerializer(serializers.ModelSerializer):
    received_tips = TipSerializer(many=True)
    sent_tips = TipSerializer(many=True)
    class Meta:
        model = User
        fields = ('id', 'email', 'profile_photo', 'is_contributor','profile_description','username','received_tips','sent_tips')
        
class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'profile_photo', 'is_contributor','profile_description','username')
        
class SubscriptionsSerializer(serializers.ModelSerializer):
    subscriptions = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['subscriptions'] # do not change this

