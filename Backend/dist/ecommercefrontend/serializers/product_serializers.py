# ecommercefrontend/serializers/product_serializers.py
from rest_framework import serializers
from ..models import Product, CartItem, Category 

# class ProductSerializer(serializers.ModelSerializer):
#     category_name = serializers.CharField(source='category.name', read_only=True)
#     # Product Card Requirement: is_in_cart, is_in_wishlist 

#     #  Product Card lo Cart Status chudaniki (Optional: Advanced Implementation)
#     #  Discount Fields
#     discount_price = serializers.SerializerMethodField()
#     is_in_cart = serializers.SerializerMethodField()
#     cart_item_id = serializers.SerializerMethodField()

#     class Meta:
#             model = Product
#             fields = [
#                 'id', 'name', 'description', 'price', 'image', 'is_available', 
#                 'category', 'category_name', 'discount_percent', 'discount_price',
#                 'is_in_cart', 'cart_item_id'
#             ]

#     # discounted_price calculation
#     def get_discounted_price(self, obj):
#         return obj.discount_price() 

#     def get_is_in_cart(self, obj):
#         # Request lo user untey, aha user  cart lo e product undho leydho check chaysthundhi
#         request = self.context.get('request')
#         if request and request.user.is_authenticated:
#             # actual cart check logic (Simple dummy implementation)
#             # return CartItem.objects.filter(cart__user=request.user, product=obj).exists() 
#             return False 
#         return False
    
#     def get_cart_item_id(self, obj):
#         # here cart_item id ni return chayali (Remove from Cart)
#         return None
        


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    # ✅ FIX 1: discounted_price బదులు discount_price వాడండి (మీ Requirement ప్రకారం)
    discount_price = serializers.SerializerMethodField() 
    is_in_cart = serializers.SerializerMethodField()
    cart_item_id = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'image', 'is_available', 
            'category', 'category_name', 'discount_percent', 
            
            # ✅ FIX 2: Meta fields లో discount_price వాడండి
            'discount_price',
            
            'is_in_cart', 'cart_item_id'
        ]

    # ✅ FIX 3: get_discounted_price బదులు get_discount_price వాడండి
    def get_discount_price(self, obj):
        # మోడల్‌లోని discount_price() ను పిలవడం సరిగ్గా ఉంది.
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
    class Meta:
        model = Category
        fields = ['id', 'name']
