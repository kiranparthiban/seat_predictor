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
