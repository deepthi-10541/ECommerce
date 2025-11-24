from rest_framework import serializers
from ..models import Product, CartItem, Category, SubCategory 

# class ProductSerializer(serializers.ModelSerializer):
#     category_name = serializers.CharField(source='category.name', read_only=True)
#     sub_category_name = serializers.CharField(source='sub_category.name', read_only=True) 

#     discount_price = serializers.SerializerMethodField()
#     is_in_cart = serializers.SerializerMethodField()
#     cart_item_id = serializers.SerializerMethodField()

#     class Meta:
#             model = Product
#             fields = [
#                 'id', 'name', 'description', 'price', 'image', 'is_available', 
#                 'category', 'category_name', 
#                 'sub_category', 'sub_category_name',
#                 'discount_percent', 'discount_price', 'product_code',
#                 'is_in_cart', 'cart_item_id'
#             ]

#     # discounted_price calculation
#     def get_discount_price(self, obj):
#         return obj.discount_price() 
    
#     def get_is_in_cart(self, obj):
#         request = self.context.get('request')
#         if request and request.user.is_authenticated:
#             return False 
#         return False
    
#     def get_cart_item_id(self, obj):
#         return None
        

# class SubCategorySerializer(serializers.ModelSerializer):
#     category_name = serializers.CharField(source='category.name', read_only=True) 

#     class Meta:
#         model = SubCategory
#         fields = ['id', 'category', 'category_name', 'name', 'image', 'description'] 
#         read_only_fields =['created_at']

class SubCategorySerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()

    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'image', 'products']
    
    def get_products(self, obj):
        products_queryset = obj.products.filter(is_available=True).order_by('product_code', 'id')
        
        return ProductSerializer(products_queryset, many=True, context=self.context).data


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    sub_category_name = serializers.CharField(source='sub_category.name', read_only=True) 

    discount_price = serializers.SerializerMethodField()
    is_in_cart = serializers.SerializerMethodField()
    cart_item_id = serializers.SerializerMethodField()

    class Meta:
            model = Product
            fields = [
                'id', 'name', 'description', 'price', 'image', 'is_available', 
                'category', 'category_name', 
                'sub_category', 'sub_category_name',
                'discount_percent', 'discount_price', 'product_code',
                'is_in_cart', 'cart_item_id'
            ]

    # discounted_price calculation
    def get_discount_price(self, obj):
        return obj.discount_price() 
    
    def get_is_in_cart(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return False 
        return False
    
    def get_cart_item_id(self, obj):
        return None
    

# Category List
class CategorySerializer(serializers.ModelSerializer):
    # subcategories = serializers.SerializerMethodField() 
    subcategories = SubCategorySerializer(many=True, read_only=True, source='subcategory_set')

    class Meta:
        model = Category
        fields = ['id', 'name', 'subcategories'] 

    # def get_subcategories(self, obj):
    #     return [{'id': sc.id, 'name': sc.name, 'image': sc.image.url if sc.image else None} for sc in obj.subcategories.all()]