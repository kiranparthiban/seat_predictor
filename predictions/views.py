import json
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .ai_engine import AiEngine
from auth_app.models import PredictionResult
from django.contrib.auth.models import User

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")
ai_engine = AiEngine(base_dir=MODEL_DIR)

@csrf_exempt
def predict_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)
        
        # Extract and validate class_12_percentage
        raw_percentage = str(data.get('class_12_percentage', '0')).strip().replace('%', '')
        try:
            class_12_percentage = float(raw_percentage)
        except ValueError:
            return JsonResponse({"error": "Invalid percentage format."}, status=400)
        
        if not (0 <= class_12_percentage <= 100):
            return JsonResponse({"error": "Percentage must be between 0 and 100."}, status=400)
        
        # Validate category
        try:
            category = int(data.get('category', 0))
        except (ValueError, TypeError):
            return JsonResponse({"error": "Category must be an integer."}, status=400)
        
        if category not in {0, 1, 2, 3}:
            return JsonResponse({"error": "Invalid category. Use 0, 1, 2, or 3."}, status=400)
        
        # Extract streams
        school_stream = str(data.get('stream', '')).strip()
        college_stream = str(data.get('degree', '')).strip()

        # Extract model type (default to 'nn' if not provided)
        model = str(data.get('model', 'nn')).strip().lower()
        
        # Validate model type (assuming allowed models are ['nn', 'svm', 'rf', 'xgboost'])
        allowed_models = {'nn', 'log', 'xgb'}
        if model not in allowed_models:
            return JsonResponse({"error": f"Invalid model type. Choose from {', '.join(allowed_models)}."}, status=400)

        # Predict using AI
        try:
            probability = ai_engine.predict(
                marks_12th=class_12_percentage,
                school_stream=school_stream,
                college_stream=college_stream,
                category=category,
                model=model  # Dynamically using the provided model
            )
        except Exception as e:
            return JsonResponse({"error": f"Prediction failed: {str(e)}"}, status=500)
        
        # Scale probability to range 0-100
        probability *= 100  

        # Apply probability adjustment based on marks
        if class_12_percentage < 35:
            adjusted_prob = 0  # Direct rejection
        else:
            # Quadratic decay scaling based on marks
            scaling_factor = (class_12_percentage / 100) ** 2
            adjusted_prob = probability * scaling_factor

        # Ensure probability is within 0-100 range
        adjusted_prob = max(0, min(100, adjusted_prob))

        # Get the user from the request or from the username in the data
        user = None
        
        # First check if user is authenticated
        if request.user.is_authenticated:
            user = request.user
        # If not, try to get username from the data and find the user
        elif 'username' in data and data['username']:
            try:
                user = User.objects.get(username=data['username'])
            except User.DoesNotExist:
                # If user doesn't exist, we'll leave user as None
                pass
        
        # Create the prediction record
        PredictionResult.objects.create(
            user=user,
            class_12_percentage=class_12_percentage,
            category=category,
            school_stream=school_stream,
            college_stream=college_stream,
            model_used=model,
            result_percentage=adjusted_prob
        )

        # Prepare response
        response_data = {
            **{k: str(data.get(k, '')) for k in ['name', 'date_of_birth', 'mobile_number', 
                                               'gender', 'email', 'religion', 'course']},
            "stream": school_stream,
            "degree": college_stream,
            "category": category,
            "model_used": model,  # Include the model name in the response
            "class_12_percentage": round(class_12_percentage, 2),
            "seat_selection_probability": round(adjusted_prob, 2)
        }
        return JsonResponse(response_data, status=200)
    
    return JsonResponse({"error": "POST required."}, status=405)
