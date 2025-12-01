from rest_framework import serializers
from ..models import Product, CartItem, Category, SubCategory 

# 1. ProductSerializer
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
    

# 2. SubCategorySerializer
class SubCategorySerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=True)

    products = serializers.SerializerMethodField()

    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'image', 'category', 'products']
    
    def get_products(self, obj):
        products_queryset = obj.products.filter(is_available=True).order_by('product_code', 'id')
        
        return ProductSerializer(products_queryset, many=True, context=self.context).data

# 
# 3. CategorySerializer
class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True, source='nested_subs') 

    class Meta:
        model = Category
        fields = ['id', 'name', 'subcategories']


class SimpleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]




