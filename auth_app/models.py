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

class UserLogin(models.Model):
    """
    Tracks user login events with timestamps.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='logins')
    login_time = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username} logged in at {self.login_time}"
    
    class Meta:
        ordering = ['-login_time']

class PredictionResult(models.Model):
    """
    Stores prediction results with timestamps and user information.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='predictions', null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    class_12_percentage = models.FloatField()
    category = models.IntegerField()
    school_stream = models.CharField(max_length=100, blank=True)
    college_stream = models.CharField(max_length=100, blank=True)
    model_used = models.CharField(max_length=20)
    result_percentage = models.FloatField()
    
    def __str__(self):
        username = self.user.username if self.user else "Anonymous"
        return f"{username}'s prediction ({self.result_percentage}%) at {self.timestamp}"
    
    class Meta:
        ordering = ['-timestamp']
