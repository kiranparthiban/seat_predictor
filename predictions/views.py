import json
import random
import re
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

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

    Returns a random seat_selection_probability for demonstration.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Parse raw JSON
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

        # Extract basic fields
        name = data.get('name')
        date_of_birth = data.get('date_of_birth')
        mobile_number = data.get('mobile_number')
        gender = data.get('gender')
        email = data.get('email')
        religion = data.get('religion')
        course = data.get('course')
        stream = data.get('stream')
        degree = data.get('degree')
        category = data.get('category')

        # Get the 'class_12_percentage' field, which might be "85", "85.0", or "85%"
        raw_percentage_str = data.get('class_12_percentage', '0').strip()

        # 1) Remove trailing "%" if present. For example, "85%" -> "85", "90.5%" -> "90.5"
        if raw_percentage_str.endswith('%'):
            raw_percentage_str = raw_percentage_str[:-1].strip()

        # 2) (Optionally) strip out any non-numeric chars if you want to be more robust
        #    E.g., if someone typed "85% approx."
        # raw_percentage_str = re.sub(r'[^0-9\.]', '', raw_percentage_str)

        # 3) Convert to float safely
        try:
            class_12_percentage = float(raw_percentage_str)
        except ValueError:
            class_12_percentage = 0.0

        # 4) Clamp percentage to [0, 100] if desired
        #    (useful in case user typed something like "110%" or "-5%")
        # class_12_percentage = min(max(class_12_percentage, 0.0), 100.0)

        # Generate dummy seat probability
        seat_probability = round(random.uniform(0, 100), 2)

        response_data = {
            "name": name,
            "date_of_birth": date_of_birth,
            "mobile_number": mobile_number,
            "gender": gender,
            "email": email,
            "religion": religion,
            "course": course,
            "stream": stream,
            "degree": degree,
            "category": category,
            "class_12_percentage": round(class_12_percentage, 2),
            "seat_selection_probability": seat_probability
        }
        return JsonResponse(response_data, status=200)

    return JsonResponse({"error": "Only POST requests are allowed."}, status=405)
