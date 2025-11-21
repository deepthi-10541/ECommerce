# ecommercefrontend/views/product_views.py
from rest_framework import generics, status
from rest_framework.permissions import AllowAny 
from rest_framework.response import Response
from ..models import Product, Category
from ..serializers.product_serializers import ProductSerializer, CategorySerializer

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
    queryset = Category.objects.all().order_by('name')
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
    #(old ProductDetailView code)
    queryset = Product.objects.filter(is_available=True)
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
        

class ProductSuggestionsView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny] 

    def get_queryset(self):
        category_id = self.kwargs.get('category_pk')
        product_identifier = self.kwargs.get('product_identifier') # '5' or '5.1'

        if not product_identifier:
            return Product.objects.none()
        
        try:
            # 1. Get the current product using the product_code (e.g., '5' or '5.1')
            current_product = Product.objects.get(
                product_code=product_identifier, 
                category__id=category_id, 
                is_available=True
            )
            
            current_product_id = current_product.id
            
            # 2. Filtering Logic for Suggestions
            if '.' in product_identifier:
                # Case: Sub-Product (e.g., 5.1). Find other variants in the 5-group (5.2, 5.3)
                parent_code = product_identifier.split('.')[0] # Gets '5'
                
                # Filter for products in the same category whose product_code starts with '5'
                queryset = Product.objects.filter(
                    category=current_product.category,
                    product_code__startswith=parent_code, 
                    is_available=True
                ).exclude(id=current_product_id) 
            
            else:
                # Case: Main Product (e.g., 5). Find other products in the same category 
                queryset = Product.objects.filter(
                    category=current_product.category, 
                    is_available=True
                ).exclude(id=current_product_id) 
            
            # 3. Limit to 10 Suggestions
            return queryset[:10] 
            
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
        ).order_by('name')
        
        return queryset
        
        
