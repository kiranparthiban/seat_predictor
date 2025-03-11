# predictions/urls.py

from django.urls import path
from .views import predict_view

app_name = "predictions"

urlpatterns = [
    path('', predict_view, name='predict'),  # e.g. /api/predict/
]
