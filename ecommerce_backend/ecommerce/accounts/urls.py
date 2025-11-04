from django.urls import path
from .views import LoginView, HomeView, BuyerRegisterView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('home/', HomeView.as_view(), name='home'),
    path('register-buyer/', BuyerRegisterView.as_view(), name='register_buyer'),
]
