from django.urls import path
from ecommercefrontend.views.product_views import( 
  ProductListView, ProductDetailView, CategoryListView, ProductSuggestionsView, 
  CategoryDetailView, CategoryProductsView, SubCategoryListCreateAPIView, 
  SubCategoryListCreateAPIView, SubCategoryProductsView, ProductCreateAPIView, CategoryTreeView, ProductTreeView
)
urlpatterns = [
    # GET: /products/list/ 
    path('products/list/', ProductListView.as_view()),

    path('products/add/', ProductCreateAPIView.as_view(), name='product-add'),

    path('products/tree/<str:product_code>/', ProductTreeView.as_view(), name='product-tree'),

    # GET: /products/categories/
    path('products/categories/', CategoryListView.as_view()), # Category List

    # GET: /products/categories/<id>/
    # path('products/categories/<int:pk>/', CategoryRetrieveView.as_view()), # Category Details (ID)
    # path('categories/<int:pk>/', CategoryRetrieveView.as_view()),

    # GET: /products/category-products/<id>/ (Category ID 1 inside product)
    # path('products/category-products/<int:pk>/', CategoryProductsView.as_view()),

    path('products/categories/<int:category_pk>/', CategoryTreeView.as_view(), name='category-detail'),

    path('products/categories/<int:category_pk>/<int:sub_category_pk>/', CategoryTreeView.as_view(), name='subcategory-detail'),

    path('products/categories/<int:category_pk>/<int:sub_category_pk>/<int:product_pk>/', CategoryTreeView.as_view(), name='product-detail'),

    # GET: /products/<id>/
    path('products/<int:pk>/', ProductDetailView.as_view()),

    # -------------------- SubCategory Endpoints --------------------
    
    # GET: /products/categories/1/sub-categories/ (Category ID 1 lo SubCategory)
    path('products/categories/<int:category_pk>/sub-categories/', SubCategoryListCreateAPIView.as_view(), name='category-subcategories-list'),
    
    # GET: /products/sub-categories/<id>/ ( single SubCategory details)
    # path('products/sub-categories/<int:pk>/', SubCategoryDetailAPIView.as_view(), name='subcategory-detail'),

    path('categories/<int:category_pk>/sub-categories/', SubCategoryListCreateAPIView.as_view(), name='subcategories'),


    # -------------------- SubCategory Products & Suggestions --------------------
    
    # SubCategory inside Products (SubCategory ID directly can we use)
    # GET: /products/sub-category-products/1/ (SubCategory ID 1 Products)
    path('products/sub-category-products/<int:sub_category_pk>/', SubCategoryProductsView.as_view(), name='subcategory-products'),

    # SubCategory lo Product Suggestions (e.g., product_code 1.1.1)
    # GET: /products/sub-category-suggestions/<str:product_code>/
    path('products/sub-category-suggestions/<str:product_code>/', ProductSuggestionsView.as_view(), name='subcategory-suggestions'),
]