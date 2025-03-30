# auth_app/views.py
import json
from django.http import JsonResponse
from django.shortcuts import redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from .forms import SimpleRegisterForm
from .models import UserLogin, PredictionResult
from django.contrib.auth.models import User


@csrf_exempt
def register(request):
    if request.method == "POST":
        try:
            # 1) Parse JSON body yourself
            body_data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        # 2) Initialize form with the parsed data
        form = SimpleRegisterForm(body_data)
        if form.is_valid():
            form.save()
            return JsonResponse({"message": "Registration successful!"}, status=201)
        else:
            return JsonResponse({"error": "Invalid data", "details": form.errors}, status=400)

    return JsonResponse({"error": "Only POST allowed"}, status=405)


@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        username = data.get("username")
        password = data.get("password")
        user_type = data.get("user_type", "student")  # Default to student login

        # Check if this is an admin login attempt
        if user_type == "admin":
            if username == "admin" and password == "admin123":
                # Find or create admin user
                admin_user, created = User.objects.get_or_create(
                    username="admin",
                    defaults={
                        "is_staff": True,
                        "is_superuser": True,
                        "email": "admin@example.com"
                    }
                )
                
                # If admin user was just created, set password
                if created:
                    admin_user.set_password("admin123")
                    admin_user.save()
                
                # Log in the admin
                login(request, admin_user)
                
                # Record login
                UserLogin.objects.create(
                    user=admin_user,
                    ip_address=request.META.get('REMOTE_ADDR')
                )
                
                return JsonResponse({
                    "message": "Admin login successful",
                    "is_authenticated": True,
                    "is_admin": True,
                    "username": "admin"
                }, status=200)
            else:
                return JsonResponse({"error": "Invalid admin credentials"}, status=401)
        
        # Regular user authentication
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            
            # Record the login
            UserLogin.objects.create(
                user=user,
                ip_address=request.META.get('REMOTE_ADDR')
            )
            
            return JsonResponse({
                "message": f"Logged in as {username}.",
                "is_authenticated": True,
                "is_admin": False,
                "username": username
            }, status=200)
        else:
            return JsonResponse({"error": "Invalid username or password."}, status=401)

    return JsonResponse({"error": "Only POST requests are allowed."}, status=405)


@csrf_exempt
def logout_view(request):
    """
    API endpoint to handle user logout.
    Returns JSON responses and does NOT render templates.
    """
    if request.method == "POST":
        logout(request)
        messages.success(request, "You have been logged out.")
        return JsonResponse({"message": "Logged out successfully."}, status=200)
    return JsonResponse({"error": "Only POST requests are allowed."}, status=405)


@csrf_exempt
def check_auth_status(request):
    """
    API endpoint to check if a user is authenticated and if they are an admin.
    """
    if request.method == "GET":
        is_authenticated = request.user.is_authenticated
        is_admin = is_authenticated and request.user.username == 'admin'
        
        return JsonResponse({
            "is_authenticated": is_authenticated,
            "is_admin": is_admin
        })
    
    return JsonResponse({"error": "Only GET requests are allowed."}, status=405)


@csrf_exempt
def admin_get_logins(request):
    """
    API endpoint to get user login history for admin dashboard.
    """
    if request.method == "GET":
        # Check admin credentials from query parameters
        admin_user = request.GET.get('admin_user')
        admin_pass = request.GET.get('admin_pass')
        
        if admin_user == 'admin' and admin_pass == 'admin123':
            # Get login history
            logins = UserLogin.objects.all()[:100]  # Limit to 100 most recent
            
            login_data = [{
                "id": login.id,
                "username": login.user.username,
                "login_time": login.login_time.isoformat(),
                "ip_address": login.ip_address
            } for login in logins]
            
            return JsonResponse({"logins": login_data}, status=200)
        
        return JsonResponse({"error": "Unauthorized"}, status=401)
    
    return JsonResponse({"error": "Only GET requests are allowed."}, status=405)


@csrf_exempt
def admin_get_predictions(request):
    """
    API endpoint to get prediction results for admin dashboard.
    """
    if request.method == "GET":
        # Check admin credentials from query parameters
        admin_user = request.GET.get('admin_user')
        admin_pass = request.GET.get('admin_pass')
        
        if admin_user == 'admin' and admin_pass == 'admin123':
            # Get prediction history
            predictions = PredictionResult.objects.all()[:100]  # Limit to 100 most recent
            
            prediction_data = []
            for pred in predictions:
                # Set a default username if user is None
                username = "Anonymous"
                if pred.user:
                    username = pred.user.username
                
                prediction_data.append({
                    "id": pred.id,
                    "username": username,
                    "timestamp": pred.timestamp.isoformat(),
                    "class_12_percentage": pred.class_12_percentage,
                    "result_percentage": pred.result_percentage,
                    "model_used": pred.model_used,
                    "school_stream": pred.school_stream,
                    "college_stream": pred.college_stream
                })
            
            return JsonResponse({"predictions": prediction_data}, status=200)
        
        return JsonResponse({"error": "Unauthorized"}, status=401)
    
    return JsonResponse({"error": "Only GET requests are allowed."}, status=405)
