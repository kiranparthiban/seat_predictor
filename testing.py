import requests
import json

# Set the API URL (adjust the port if needed)
API_URL = "http://127.0.0.1:8000/api/predict/"  # Change this if your server is running on a different URL

# Sample test data
payload = {
    "name": "John Doe",
    "date_of_birth": "2002-05-15",
    "mobile_number": "9876543210",
    "gender": "Male",
    "email": "johndoe@example.com",
    "religion": "Christianity",
    "course": "B.Tech",
    "stream": "Science",
    "degree": "Engineering",
    "category": 2,
    "class_12_percentage": "85%"  # Can be in various formats like "85", "85.0", or "85%"
}

# Send a POST request to the API
response = requests.post(API_URL, data=json.dumps(payload), headers={"Content-Type": "application/json"})

# Print the response
print("Status Code:", response.status_code)
print("Response JSON:", response.json())
