import json
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .ai_engine import AiEngine

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
        
        # Predict
        try:
            probability = ai_engine.predict(
                marks_12th=class_12_percentage,
                school_stream=school_stream,
                college_stream=college_stream,
                category=category,
                model="nn"
            )
        except Exception as e:
            return JsonResponse({"error": f"Prediction failed: {str(e)}"}, status=500)
        
        # Prepare response
        response_data = {
            **{k: str(data.get(k, '')) for k in ['name', 'date_of_birth', 'mobile_number', 
                                               'gender', 'email', 'religion', 'course']},
            "stream": school_stream,
            "degree": college_stream,
            "category": category,
            "class_12_percentage": round(class_12_percentage, 2),
            "seat_selection_probability": round(probability, 4)
        }
        return JsonResponse(response_data, status=200)
    
    return JsonResponse({"error": "POST required."}, status=405)