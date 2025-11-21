# ecommercefrontend/urls/product_urls.py
from django.urls import path
from ecommercefrontend.views.product_views import ProductListView, ProductDetailView, CategoryListView, ProductSuggestionsView, CategoryDetailView, CategoryProductsView
urlpatterns = [
    # GET: /products/list/ (Electronics excluded)
    path('products/list/', ProductListView.as_view()),
    
    # GET: /products/categories/
    path('products/categories/', CategoryListView.as_view()), # Category List
    
    # GET: /products/<id>/
    path('products/<int:pk>/', ProductDetailView.as_view()),

    # # GET:/products/suggestions/1/
    # path('products/suggestions/<int:pk>/', ProductSuggestionsView.as_view()),

    # GET: /products/categories/1/ (call with categorie id)
    path('products/categories/<int:pk>/', CategoryDetailView.as_view()),

    # /products/category-products/1/
    path('products/category-products/<int:pk>/', CategoryProductsView.as_view()),

    path(
        'products/by-category/<int:category_pk>/<str:product_identifier>/', 
        ProductSuggestionsView.as_view()
    ),
]
 