from django.contrib import admin
from .models import User, Category, Product, Cart, CartItem 
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# 1. Custom User Model can register
# Custom User Model (AbstractBaseUser) can we using so, Admin also we can Customize
class UserAdmin(BaseUserAdmin):
    # display fields on the list page
    list_display = ('phone', 'first_name', 'last_name', 'is_staff', 'is_profile_complete') 
    # fields that can be searched
    search_fields = ('phone', 'first_name', 'email')
    # fields for adding/changing a user
    ordering = ('phone',)
    
    # Custom Fieldsets (we can use or other wise leave)
    fieldsets = (
        (None, {'fields': ('phone', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'is_profile_complete')}),
        ('Address', {'fields': ('address_line_1', 'street_name', 'city', 'state', 'pincode')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes':('wide',),
            'fields':('phone','password1','password2','is_staff','is_active'),
        }),
    )


# Product Model Admin
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'category', 'price', 'discount_percent', 'discounted_price_display', 'is_available'
    )
    list_filter = ('category', 'is_available')
    search_fields = ('name', 'description')
    
    # discount_percent based amount can display
    readonly_fields = ('discounted_price_display',) 

    def discounted_price_display(self, obj):
        return obj.discount_price()
    discounted_price_display.short_description = 'Discounted Price'
    
    fieldsets = (
        (None, {'fields': ('name', 'description', 'category', 'image', 'product_code')}),
        ('Pricing & Stock', {'fields': ('price', 'discount_percent', 'discounted_price_display', 'is_available')}),
    )
class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ('total_price',)
    
    # CartItems total amount
    def total_price(self, obj):
        return obj.total_price()
    total_price.short_description = 'Total Price'


# Cart Model Admin (Inline)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('user__phone',)
    inlines = [CartItemInline] # CartItem can we display here



#  Registering the Models
admin.site.register(User, UserAdmin)
admin.site.register(Category)
admin.site.register(Product, ProductAdmin) # ProductAdmin
admin.site.register(Cart, CartAdmin)       # CartAdmin
admin.site.register(CartItem)