from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import LoginSerializer, BuyerRegisterSerializer


# ---------- LOGIN ----------
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": f"Welcome {user.username}",
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })


# ---------- HOME ----------
class HomeView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "message": f"Welcome {user.username} to Home Page!",
            "is_buyer": user.is_buyer,
            "note": "You can view products. Register to buy."
        })


# ---------- BUYER REGISTRATION ----------
class BuyerRegisterView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BuyerRegisterSerializer

    def get_object(self):
        return self.request.user  # update current logged-in user

    def put(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Buyer details saved successfully!"})
