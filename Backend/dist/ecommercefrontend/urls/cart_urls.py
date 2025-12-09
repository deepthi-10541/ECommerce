# ecommercefrontend/urls/cart_urls.py
from django.urls import path
from ecommercefrontend.views.cart_views import AddToCartView, CartDetailView

urlpatterns = [
    # POST: /api/cart/add/
    path('add/', AddToCartView.as_view()),
    # GET: /api/cart/details/
    path('details/', CartDetailView.as_view()),
]