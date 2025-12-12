# ecommercefrontend/views/product_views.py
from rest_framework import generics, status, viewsets, permissions

from rest_framework.permissions import AllowAny 
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import Product, Category, SubCategory
from ..serializers.product_serializers import ProductSerializer, CategorySerializer, SubCategorySerializer, SimpleCategorySerializer

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
    
# class CategoryListView(generics.ListAPIView):
#     queryset = Category.objects.all().order_by('id')
#     serializer_class = SimpleCategorySerializer
#     permission_classes = [AllowAny]

#     def list(self, request, *args, **kwargs):
#         queryset = self.get_queryset()
#         serializer = self.get_serializer(queryset, many=True)

#         category_list = [
#             {"id": 0, "name": "All"}
#         ]
#         category_list.extend(serializer.data)
#         return Response(category_list)


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
# class ProductSuggestionsView(generics.ListAPIView):
#     serializer_class = ProductSerializer
#     permission_classes = [AllowAny] 

#     def get_queryset(self):
#         # from url we taking product(example: '1.1.1', '1.2.5')
#         product_code = self.kwargs.get('product_code') 

#         if not product_code or product_code.count('.') < 2: 
#             return Product.objects.none()
        
#         try:
#             current_product = get_object_or_404(
#                 Product, 
#                 product_code=product_code, 
#                 is_available=True
#             )
#             current_product_id = current_product.id
            
#             # SubCategory Identifier
#             sub_category_identifier = ".".join(product_code.split('.')[:-1]) 
            
#             queryset = Product.objects.filter(
#                 # product_code '1.1.' starting once(1.1.X)
#                 product_code__startswith=sub_category_identifier + '.', 
#                 is_available=True
#             )
#                 # .exclude(id=current_product_id)
            
#             # 3. Limit to 10 Suggestions
#             return queryset.order_by('product_code')[:10] 
            
#         except Product.DoesNotExist:
#             return Product.objects.none() 

   

class ProductSuggestionsView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        product_code = self.kwargs.get('product_code')

        if not product_code:
            return Product.objects.none()

        # If it's a full product code with 2 dots (like 1.2.1)
        if product_code.count('.') == 2:
            current_product = Product.objects.filter(
                product_code=product_code,
                is_available=True
            ).first()
            if current_product:
                sub_category_identifier = ".".join(product_code.split('.')[:-1])
                return Product.objects.filter(
                    product_code__startswith=sub_category_identifier + '.',
                    is_available=True
                ).order_by('product_code')

            return Product.objects.none()

        # If it's a subcategory code with 1 dot (like 1.2)
        elif product_code.count('.') == 1:
            return Product.objects.filter(
                product_code__startswith=product_code + '.',
                is_available=True
            ).order_by('product_code')

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
        
# class SubCategoryDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = SubCategory.objects.all().select_related("category")
#     serializer_class = SubCategorySerializer
#     permission_classes = [AllowAny]

#     def get_queryset(self):
#         base_qs = self.queryset
#         category_id = self.kwargs.get("category_pk")
        
#         if category_id:
#             return base_qs.filter(category_id=category_id)
        
#         return base_qs  


class SubCategoryListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = SubCategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        category_id = self.kwargs.get("category_pk")
        if category_id:
            return SubCategory.objects.filter(category_id=category_id)
        return SubCategory.objects.all()

    def perform_create(self, serializer):
        category_id = self.kwargs.get("category_pk")
        serializer.save(category_id=category_id)
    
# class CategoryRetrieveView(generics.RetrieveAPIView):
#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer 
#     permission_classes = [AllowAny]
#     lookup_field = 'pk'


# Admin-only product creation
class ProductCreateAPIView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # permission_classes = [permissions.IsAdminUser]  # Only admin can add
    permission_classes = [permissions.IsAuthenticated] 



class ProductTreeView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        code = self.kwargs.get("product_code")

        # ---------------- CATEGORY LEVEL ("1" ) ----------------
        if code.isdigit():
            category = Category.objects.filter(id=code).first()
            if not category:
                return Response({"error": "Invalid category code"}, status=404)

            subcats = SubCategory.objects.filter(category_id=category.id).order_by("id")

            next_items = [
                {"code": f"{category.id}.{s.id}", "name": s.name}
                for s in subcats
            ]

            # Sort codes so they are always in correct order
            next_items = sorted(next_items, key=lambda x: int(x["code"].split(".")[-1]))

            return Response({
                "level": "category",
                "category_name": category.name,
                # "next": next_items
                "next": [{"id": i.id, "code": f"{category.id}.{i.id}", "name": i.name} for i in subcats]

            })

        # ---------------- SUBCATEGORY LEVEL ("1.2" ) ----------------
        if code.count('.') == 1:
            try:
                category_id, sub_id = code.split('.')
                subcategory = SubCategory.objects.get(id=sub_id, category_id=category_id)

                products = Product.objects.filter(
                    sub_category_id=subcategory.id,
                    is_available=True
                ).order_by("id")

                # Sorting products by product_code (1.2.1, 1.2.2, 1.2.3)
                sorted_products = sorted(
                    products,
                    key=lambda p: [int(x) for x in p.product_code.split(".")]
                )

                return Response({
                    "level": "subcategory",
                    "subcategory_name": subcategory.name,
                    "products": ProductSerializer(sorted_products, many=True).data
                })

            except SubCategory.DoesNotExist:
                return Response({"error": "Invalid subcategory code"}, status=404)

        # ---------------- PRODUCT GROUP LEVEL ("1.2.1" ) ----------------
        if code.count('.') == 2:
            products = Product.objects.filter(
                product_code__startswith=code,
                is_available=True
            ).order_by("id")

            if not products.exists():
                return Response({"error": "Invalid product code"}, status=404)

            sorted_products = sorted(
                products,
                key=lambda p: [int(x) for x in p.product_code.split(".")]
            )

            return Response({
                "level": "product-group",
                "products": ProductSerializer(sorted_products, many=True).data
            })

        return Response({"error": "Invalid format"}, status=400)


class CategoryTreeView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, category_pk=None, sub_category_pk=None, product_pk=None, *args, **kwargs):
        # ------------------ CASE 1: All Categories ------------------
        if category_pk is None:
            categories = Category.objects.all().order_by("id")
            serializer = CategorySerializer(categories, many=True, context={"request": request})
            data = [{"id": 0, "name": "All"}] + serializer.data
            return Response(data)

        # ------------------ CASE 2: Category details ------------------
        if category_pk and sub_category_pk is None and product_pk is None:
            category = get_object_or_404(Category, id=category_pk)
            serializer = CategorySerializer(category, context={"request": request})
            return Response(serializer.data)

        # ------------------ CASE 3: SubCategory details ------------------
        if category_pk and sub_category_pk and product_pk is None:
            subcategory = get_object_or_404(SubCategory, id=sub_category_pk, category_id=category_pk)
            serializer = SubCategorySerializer(subcategory, context={"request": request})
            return Response(serializer.data)

        # ------------------ CASE 4: Product details ------------------
        if category_pk and sub_category_pk and product_pk:
            product = get_object_or_404(Product, id=product_pk, category_id=category_pk, sub_category_id=sub_category_pk)
            serializer = ProductSerializer(product, context={"request": request})
            return Response(serializer.data)

        return Response({"error": "Invalid URL parameters"}, status=400)



