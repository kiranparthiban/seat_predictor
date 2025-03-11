# auth_app/views.py
import json
from django.http import JsonResponse
from django.shortcuts import redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from .forms import SimpleRegisterForm


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

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"message": f"Logged in as {username}."}, status=200)
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
