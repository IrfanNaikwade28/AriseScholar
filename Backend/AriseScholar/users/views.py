from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import RegisterSerializer, LoginSerializer,UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.views import APIView


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        data = {
            "success": True,
            "data": {
                "user_id": user.id,
                "email": user.email,
                "username": user.username,
                "study_goal": user.study_goal,
            },
            "message": "Signup successful"
        }
        return Response(data, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        data = {
            "success": True,
            "data": {
                "token": access_token,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "xp": user.xp,
                    "level": user.level,
                    "streak": user.streak
                }
            },
            "message": "Login successful"
        }
        return Response(data, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response({
            "success": True,
            "data": serializer.data
        })