from django.contrib.auth import get_user_model
User = get_user_model()

from .serializers import UserSerializer, SubscriptionsSerializer, TipSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import Tip
class RegisterView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request):
        try:
            data = request.data
            serializer = UserSerializer(data)
            
            email = data['email']
            email = email.lower()
            password = data['password']
            
            re_password = data['re_password']
            is_contributor = data['is_contributor']

            username = data['username']
            if is_contributor == 'True':
                is_contributor = True
            else:
                is_contributor = False

            if password == re_password:
                if len(password) >= 8:
                    if not User.objects.filter(email=email).exists():
                        if not is_contributor:
                            User.objects.create_user(email=email, password=password, username=username)

                            return Response(
                                {'success': 'User created successfully'},
                                status=status.HTTP_201_CREATED
                            )
                        else:
                            User.objects.create_contributor(email=email, password=password, username=username)

                            return Response(
                                {'success': 'Contributor account created successfully'},
                                status=status.HTTP_201_CREATED
                            )
                    else:
                        return Response(
                            {'error': 'User with this email already exists'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                else:
                    return Response(
                        {'error': 'Password must be at least 8 characters in length'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                return Response(
                    {'error': 'Passwords do not match'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except:
            return Response(
                {'error': 'Something went wrong when registering an account'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class RetrieveCurrentUserView(APIView):
    def get(self, request, format=None):
        try:
            user = request.user
            user = CurrentUserSerializer(user)

            return Response(
                {'user': user.data},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving user details'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class RetrieveUserView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, format=None):
        try:
            user = User.objects.get(id=request.query_params.get('id'))
            user = UserSerializer(user)

            return Response(
                {'user': user.data},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class Subscribe(APIView):
    def get(self, request, format=None):
        try:
            explorer = request.user
            contributor = User.objects.get(id=request.query_params.get('id'))
            explorer.subscriptions.add(contributor)
            return Response(
                {'success': 'Subscribed'},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving user details'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class Unsubscribe(APIView):
    def get(self, request, format=None):
        try:
            explorer = request.user
            contributor = User.objects.get(id=request.query_params.get('id'))
            explorer.subscriptions.remove(contributor)
            return Response(
                {'success': 'Unsubscribed'},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving user details'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class Subscriptions(APIView):
    def get(self, request, format=None):
        try:
            user = request.user
            subscriptions=SubscriptionsSerializer(user)
            return Response(
                {'subscriptions': subscriptions.data},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class TipView(APIView):
    def post(self, request):
        try:
            user = request.user
            t = TipSerializer(data=request.data)

            if t.is_valid():    
                Tip.objects.create(sender_id=user.id, recipient_id=request.data['recipient_id'], message=t.validated_data['message'], icon=t.validated_data['icon'])
                return Response({'success': 'Tip added'}, status=status.HTTP_201_CREATED)
            else:
                return Response(t.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
