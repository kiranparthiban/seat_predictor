# auth_app/models.py

from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    """
    A simple user profile extension that stores phone number.
    Linked to Django's built-in User model via OneToOneField.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"
