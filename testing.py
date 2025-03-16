import requests
import random
import json
import time

# API endpoint (assuming running on localhost)
API_URL = "http://127.0.0.1:8000/api/predict/"

# Models to test
MODELS = ["nn","log", "xgb"]

# Generate 10 test cases with random data
def generate_test_data():
    test_data = []
    for _ in range(10):
        data = {
            "name": f"TestUser{random.randint(1, 1000)}",
            "date_of_birth": f"{random.randint(1990, 2010)}-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}",
            "mobile_number": f"98765{random.randint(10000, 99999)}",
            "gender": random.choice(["Male", "Female", "Other"]),
            "email": f"test{random.randint(1, 1000)}@example.com",
            "religion": random.choice(["Hindu", "Muslim", "Christian", "Sikh", "Other"]),
            "course": random.choice(["B.Tech", "B.Sc", "B.A", "B.Com", "M.Tech", "MBA"]),
            "stream": random.choice(["Science", "Commerce", "Arts"]),
            "degree": random.choice(["B.Tech", "B.Sc", "B.A", "B.Com"]),
            "category": random.choice([0, 1, 2, 3]),
            "class_12_percentage": round(random.uniform(30, 100), 2)  # Between 30 and 100
        }
        test_data.append(data)
    return test_data

# Function to send test cases to API
def send_requests(test_cases):
    results = []
    
    for model in MODELS:
        print(f"\nTesting model: {model}\n" + "-" * 30)
        
        for idx, test_case in enumerate(test_cases):
            # Add the model to the request payload
            test_case["model"] = model
            
            try:
                response = requests.post(API_URL, json=test_case)
                result = response.json()
                
                # Print response summary
                print(f"Test {idx+1} -> Status: {response.status_code}, Probability: {result.get('seat_selection_probability', 'N/A')}")
                results.append(result)
                
            except Exception as e:
                print(f"Test {idx+1} -> Request failed: {str(e)}")

            time.sleep(0.5)  # Delay to avoid overwhelming server

    return results

if __name__ == "__main__":
    print("Generating test data...")
    test_cases = generate_test_data()
    
    print("\nSending requests to API...")
    responses = send_requests(test_cases)
    
    # Save results to a JSON file
    with open("test_results.json", "w") as f:
        json.dump(responses, f, indent=4)
    
    print("\nTesting complete! Results saved in test_results.json.")
