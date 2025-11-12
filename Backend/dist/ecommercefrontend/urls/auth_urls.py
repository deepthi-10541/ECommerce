# ecommercefrontend/urls/auth_urls.py

from django.urls import path
from ecommercefrontend.views.auth_views import SendOTPView, VerifyOTPView, HomeView, ProfileCompleteView 

urlpatterns = [
    # ✅ CORRECT: Using View classes (.as_view())
    path('send-otp/', SendOTPView.as_view()),
    path('verify-otp/', VerifyOTPView.as_view()),
    
    # Profile Completion
    path('profile-complete/', ProfileCompleteView.as_view()),
    
    # Other Auth URLs (uncommented HomeView)
    path('home/', HomeView.as_view()),
]