# auth_app/forms.py

from django import forms
from django.contrib.auth.models import User
from .models import Profile

class SimpleRegisterForm(forms.Form):
    """
    Minimal custom form for user registration:
      - No built-in password validators
      - Uses set_password() to store a hashed password
      - Creates a Profile with phone_number
    """
    username = forms.CharField(required=True, max_length=150)
    email = forms.EmailField(required=True)
    phone_number = forms.CharField(required=True, max_length=20)
    password = forms.CharField(widget=forms.PasswordInput, required=True)

    def save(self):
        # Extract cleaned form data
        username = self.cleaned_data["username"]
        email = self.cleaned_data["email"]
        phone = self.cleaned_data["phone_number"]
        password = self.cleaned_data["password"]

        # Create a new User
        user = User.objects.create(username=username, email=email)
        # Use set_password to hash the password properly
        user.set_password(password)
        user.save()

        # Create the linked Profile
        Profile.objects.create(
            user=user,
            phone_number=phone
        )

        return user
