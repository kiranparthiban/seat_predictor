import requests
import json
import pandas as pd
import joblib
import os

# Set the API URL (adjust the port if needed)
API_URL = "http://127.0.0.1:8000/api/predict/"  # Adjust based on your server

# Define the correct path to the `models` directory
MODELS_DIR = os.path.join(os.path.dirname(__file__), "predictions", "models")

# -----------------------
# Load Training Data
# -----------------------
csv_path = os.path.join(MODELS_DIR, "synthetic_student_admission_data.csv")
df = pd.read_csv(csv_path)

# Load saved label encoders and scalers from the models directory
category_encoder_path = os.path.join(MODELS_DIR, "category_label_encoder.pkl")
scaler_path = os.path.join(MODELS_DIR, "marks_scaler.pkl")

category_encoder = joblib.load(category_encoder_path)
scaler = joblib.load(scaler_path)
import requests
import json
import random

# Set the API URL
API_URL = "http://127.0.0.1:8000/api/predict/"  # Adjust based on your server

# Possible categories (assuming they were encoded in training)
categories = [0, 1, 2, 3]  # Adjust based on actual category encoding

# Possible streams for school and college
streams = ["Science", "Commerce", "Arts", "Engineering"]

# Initialize counters
count_1 = 0
count_0 = 0
count_between = 0

# Generate 100 random test samples
test_payloads = []
for i in range(100):
    marks_12th = round(random.uniform(50, 99), 2)  # Ensuring valid marks percentage
    school_stream = random.choice(streams)
    college_stream = random.choice(streams)
    category = random.choice(categories)
    
    # Create request payload
    payload = {
        "name": f"Random User {i+1}",
        "date_of_birth": f"200{random.randint(0, 9)}-0{random.randint(1, 9)}-{random.randint(10, 28)}",
        "mobile_number": f"98765{random.randint(10000, 99999)}",
        "gender": random.choice(["Male", "Female"]),
        "email": f"randomuser{i+1}@example.com",
        "religion": random.choice(["Christianity", "Hinduism", "Islam", "Buddhism"]),
        "course": random.choice(["B.Tech", "B.Sc", "B.Com", "B.A"]),
        "stream": school_stream,
        "degree": college_stream,
        "category": category,
        "class_12_percentage": f"{marks_12th}%"  # Formatting it as a string with %
    }
    test_payloads.append(payload)

# -------------------------------
# Send Requests and Count Results
# -------------------------------
print("\n--- Sending 100 Random Test Data to API ---\n")
for idx, payload in enumerate(test_payloads):
    response = requests.post(API_URL, data=json.dumps(payload), headers={"Content-Type": "application/json"})
    
    # Parse the response
    response_json = response.json()
    seat_probability = response_json.get("seat_selection_probability", None)

    if seat_probability is not None:
        if seat_probability == 1.0:
            count_1 += 1
        elif seat_probability == 0.0:
            count_0 += 1
        else:
            count_between += 1  # Values between 0 and 1

    # Print each test case's response
    print(f"Test {idx+1}: Probability = {seat_probability:.4f}")

# -------------------------------
# Print Summary Statistics
# -------------------------------
print("\n--- Summary of Predictions ---\n")
print(f"Total predictions = 100")
print(f"Number of 1.0 responses  : {count_1}")
print(f"Number of 0.0 responses  : {count_0}")
print(f"Number of values between : {count_between}")
print("\n--- End of Testing ---")

# ------------------------------
# Preprocess Data for Testing
# ------------------------------

# Create 'Same_Stream' feature
df["Same_Stream"] = (df["School_Stream"] == df["College_Stream"]).astype(int)

# Drop original 'School_Stream' and 'College_Stream'
df.drop(columns=["School_Stream", "College_Stream"], inplace=True)

# Encode 'Category' using the same encoder used in training
df["Category"] = category_encoder.transform(df["Category"])

# Select the first 10 samples for testing
test_samples = df.iloc[:10].copy()

# Scale 'Marks_12th' using the trained scaler
test_samples["Marks_12th"] = scaler.transform(test_samples[["Marks_12th"]])

# Generate corresponding input payloads
test_payloads = []
for index, row in test_samples.iterrows():
    payload = {
        "name": f"Test User {index+1}",
        "date_of_birth": f"200{index % 10}-0{(index % 9) + 1}-{(index % 28) + 1}",
        "mobile_number": f"98765{index:05d}",
        "gender": "Male" if index % 2 == 0 else "Female",
        "email": f"testuser{index+1}@example.com",
        "religion": "Hinduism",
        "course": "B.Tech",
        "stream": "Science",  # Use fixed streams since we dropped them
        "degree": "Engineering",
        "category": int(row["Category"]),  # Convert category back to int
        "class_12_percentage": f"{row['Marks_12th'] * 100:.2f}%"  # Convert back to percentage
    }
    test_payloads.append(payload)

# -------------------------------
# Send Requests and Print Results
# -------------------------------
print("\n--- Sending Test Data to API ---\n")
for idx, payload in enumerate(test_payloads):
    response = requests.post(API_URL, data=json.dumps(payload), headers={"Content-Type": "application/json"})
    
    # Print the response
    print(f"Test {idx+1}:")
    print("Sent Data:", json.dumps(payload, indent=4))
    print("Server Response:", response.json())
    print("\n" + "-" * 50 + "\n")  # Separator for readability
