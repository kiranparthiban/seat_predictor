# auth_app/urls.py

from django.urls import path
from .views import login_view, register, logout_view, admin_get_logins, admin_get_predictions, check_auth_status

app_name = "auth_app"

urlpatterns = [
    path("register/", register, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("check-auth/", check_auth_status, name="check_auth"),
    path("admin/logins/", admin_get_logins, name="admin_logins"),
    path("admin/predictions/", admin_get_predictions, name="admin_predictions"),
]
