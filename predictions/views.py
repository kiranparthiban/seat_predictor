import json
import os
import re
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .ai_engine import AiEngine  # Import the AI Engine

# Get the absolute path of the current file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")  # Ensure models/ is correctly referenced

# Initialize the AI Engine with models stored in 'models/' directory
ai_engine = AiEngine(base_dir=MODEL_DIR)

@csrf_exempt
def predict_view(request):
    """
    Handle POST requests to /api/predict via JSON data.
    Expects a JSON body with fields:
      - name
      - date_of_birth
      - mobile_number
      - gender
      - email
      - religion
      - course
      - stream
      - degree
      - category
      - class_12_percentage (e.g. "85", "85.0", or "85%")
    
    Returns a seat_selection_probability computed using AiEngine.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Parse raw JSON
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

        # Extract fields
        name = data.get('name')
        date_of_birth = data.get('date_of_birth')
        mobile_number = data.get('mobile_number')
        gender = data.get('gender')
        email = data.get('email')
        religion = data.get('religion')
        course = data.get('course')
        school_stream = data.get('stream')  # Renamed to match AI Engine naming
        college_stream = data.get('degree')  # Renamed to match AI Engine naming
        category = data.get('category')

        # Process 'class_12_percentage' field
        raw_percentage_str = data.get('class_12_percentage', '0').strip()
        if raw_percentage_str.endswith('%'):
            raw_percentage_str = raw_percentage_str[:-1].strip()
        try:
            class_12_percentage = float(raw_percentage_str)
        except ValueError:
            class_12_percentage = 0.0

        # Ensure category is numeric
        try:
            category = int(category)
        except (ValueError, TypeError):
            return JsonResponse({"error": "Invalid category format. Must be a number."}, status=400)

        # Predict seat selection probability using AI Engine
        try:
            seat_probability = ai_engine.predict(
                marks_12th=class_12_percentage,
                school_stream=school_stream,
                college_stream=college_stream,
                category=category,
                model="nn"  # Using the neural network model for prediction
            )
        except Exception as e:
            return JsonResponse({"error": f"Prediction error: {str(e)}"}, status=500)

        # Prepare response
        response_data = {
            "name": name,
            "date_of_birth": date_of_birth,
            "mobile_number": mobile_number,
            "gender": gender,
            "email": email,
            "religion": religion,
            "course": course,
            "stream": school_stream,
            "degree": college_stream,
            "category": category,
            "class_12_percentage": round(class_12_percentage, 2),
            "seat_selection_probability": seat_probability
        }
        return JsonResponse(response_data, status=200)

    return JsonResponse({"error": "Only POST requests are allowed."}, status=405)