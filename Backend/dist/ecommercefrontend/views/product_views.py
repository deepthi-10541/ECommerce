# ecommercefrontend/views/product_views.py
from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny 
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import Product, Category, SubCategory
from ..serializers.product_serializers import ProductSerializer, CategorySerializer, SubCategorySerializer

# -----------------Product List View (Excludes Electronics) -----------------
class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny] 

    def get_queryset(self):
        try:
            electronics_category = Category.objects.get(name__iexact='Electronics')
            exclude_id = electronics_category.id
        except Category.DoesNotExist:
            exclude_id = None

        queryset = Product.objects.filter(is_available=True)
        
        if exclude_id:
            queryset = queryset.exclude(category__id=exclude_id)
            
        return queryset.order_by('name')

# Category List View (Adding 'All' option)
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all().order_by('id')
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        category_list = [
            {"id": 0, "name": "All"}
        ]
        category_list.extend(serializer.data)
        return Response(category_list)
    
# Category Detail View (Single Category by ID)
class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'pk' # Primary Key (id)

# Product Detail View (unchanged)
class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_available=True)
    # queryset = Product.objects.all(is_available=True)
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    lookup_field = 'pk'


# PRODUCT SUGGESTIONS VIEW(same category products)
# class ProductSuggestionsView(generics.ListAPIView):
#     serializer_class = ProductSerializer
#     permission_classes = [AllowAny]

#     def get_queryset(self):
#         product_id = self.kwargs.get('pk')
#         try:
#             current_product = Product.objects.get(pk=product_id)
#             queryset = Product.objects.filter(
#                 Category=current_product.category,
#                 is_available=True
#             ).exclude(pk=product_id)
#             return queryset[:10]
#         except Product.DoesNotExist:
#             return Product.objects.none()
        

# SubCategory-wise Product List View
class SubCategoryProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer 
    permission_classes = [AllowAny] 

    def get_queryset(self):
        sub_category_id = self.kwargs['sub_category_pk'] 
        
        queryset = Product.objects.filter(
            sub_category__id=sub_category_id, 
            is_available=True
        ).order_by('product_code','id')
        
        return queryset

# ----------------- Product Suggestions View (SubCategory Grouping) -----------------
class ProductSuggestionsView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny] 

    def get_queryset(self):
        # from url we taking product(example: '1.1.1', '1.2.5')
        product_code = self.kwargs.get('product_code') 

        if not product_code or product_code.count('.') < 2: 
            return Product.objects.none()
        
        try:
            current_product = get_object_or_404(
                Product, 
                product_code=product_code, 
                is_available=True
            )
            current_product_id = current_product.id
            
            # SubCategory Identifier
            sub_category_identifier = ".".join(product_code.split('.')[:-1]) 
            
            queryset = Product.objects.filter(
                # product_code '1.1.' starting once(1.1.X)
                product_code__startswith=sub_category_identifier + '.', 
                is_available=True
            ).exclude(id=current_product_id) 
            
            # 3. Limit to 10 Suggestions
            return queryset.order_by('product_code')[:10] 
            
        except Product.DoesNotExist:
            return Product.objects.none() 

   
# Category-wise Product List View
class CategoryProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer # Product details can display
    permission_classes = [AllowAny] 

    def get_queryset(self):
        category_id = self.kwargs['pk'] 
        
        queryset = Product.objects.filter(
            category__id=category_id, 
            is_available=True
        ).order_by('product_code', 'id')
        
        return queryset




class SubCategoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = SubCategory.objects.all().select_related("category")
    serializer_class = SubCategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        base_qs = self.queryset
        category_id = self.kwargs.get("category_pk")
        
        if category_id:
           return base_qs.filter(category_id=category_id)
        
        return base_qs 
        
class SubCategoryDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SubCategory.objects.all().select_related("category")
    serializer_class = SubCategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        base_qs = self.queryset
        category_id = self.kwargs.get("category_pk")
        
        if category_id:
            return base_qs.filter(category_id=category_id)
        
        return base_qs  
