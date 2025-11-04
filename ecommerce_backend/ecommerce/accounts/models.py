from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    is_buyer = models.BooleanField(default=False)  # will be true after buyer registration
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    def __str__(self):
        return self.username
