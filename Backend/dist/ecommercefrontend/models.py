from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db.models.signals import pre_save
from django.dispatch import receiver

class UserManager(BaseUserManager):
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError('Users must have a phone number')

        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_profile_complete', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(phone, password, **extra_fields)

# 2. User model calss (AbstractBaseUser)
class User(AbstractBaseUser, PermissionsMixin):
    phone = models.CharField(max_length=15, unique=True)
    otp = models.CharField(max_length=6, blank=True, null=True) 

    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    
    address_line_1 = models.CharField(max_length=255, blank=True, null=True)
    street_name = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)

    is_profile_complete = models.BooleanField(default=False) 
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(auto_now_add=True) 
    last_login = models.DateTimeField(null=True, blank=True) 
    
    USERNAME_FIELD = 'phone' 
    REQUIRED_FIELDS = []
    
    objects = UserManager()

    def __str__(self):
        return self.phone

# --- 3. Category Model ---
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name
    
class SubCategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subcategories")
    name = models.CharField(max_length=150)
    image = models.ImageField(upload_to="sub-category/", blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ("category", "name")
        ordering = ["category__name", "name"]

    def __str__(self):
        # return f"{self.name} -> {self.name}"
        return self.name

# --- 4. Product Model (SubCategory can link here)
class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    
    # Product and SubCategory link here
    sub_category = models.ForeignKey(
        SubCategory, 
        on_delete=models.SET_NULL,
        related_name='products',
        null=True, 
        blank=True
    )
    
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2) 
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    
    product_code = models.CharField(max_length=50, null=True, blank=True, db_index=True) 
    
    discount_percent = models.PositiveIntegerField(default=0) # 0 to 100 
    
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def discount_price(self):
        if self.discount_percent is not None and self.discount_percent > 0:
            discount_amount = self.price * (self.discount_percent / 100)
            return self.price - discount_amount
        return self.price

    def __str__(self):
        return self.name
    
# --- 5. Cart, CartItem Models ---
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='carts')
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True) 

    def __str__(self):
        return f"Cart of {self.user.phone}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    
    def total_price(self):
        return self.quantity * self.product.discount_price() # Discount price calculation
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name}"