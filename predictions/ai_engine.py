import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import joblib
import xgboost as xgb
import os

class NeuralNet(nn.Module):
    def __init__(self, input_size):
        super(NeuralNet, self).__init__()
        self.layer1 = nn.Linear(input_size, 16)
        self.layer2 = nn.Linear(16, 8)
        self.output = nn.Linear(8, 1)
        self.relu = nn.ReLU()
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = self.relu(self.layer1(x))
        x = self.relu(self.layer2(x))
        x = self.sigmoid(self.output(x))
        return x

class AiEngine:
    def __init__(self, base_dir="."):
        self.base_dir = base_dir
        
        # Load models
        self.nn_model = self._load_nn_model()
        self.xgb_model = xgb.XGBClassifier()
        self.xgb_model.load_model(os.path.join(base_dir, "xgb_model.json"))
        self.log_model = joblib.load(os.path.join(base_dir, "log_model.pkl"))
        
        # Columns used during training (3 features)
        self.feature_names = ["Marks_12th", "Same_Stream", "Category"]

    def _load_nn_model(self):
        model = NeuralNet(input_size=3)
        state_dict = torch.load(os.path.join(self.base_dir, "nn_model.pth"))
        model.load_state_dict(state_dict)
        model.eval()
        return model

    def predict(
        self,
        marks_12th,
        school_stream,
        college_stream,
        category,
        model="nn"
    ):
        # Clip marks_12th to valid range [0, 100]
        marks_12th_clipped = max(0.0, min(float(marks_12th), 100.0))
        
        # Determine if streams match
        same_stream = 1 if school_stream.strip().lower() == college_stream.strip().lower() else 0
        
        # Validate category (assuming categories 0-5)
        if category not in {0, 1, 2, 3,4,5}:
            raise ValueError(f"Invalid category: {category}.")
        
        # Create input array
        X_array = np.array([marks_12th_clipped, same_stream, float(category)]).reshape(1, -1)
        
        if model == "nn":
            X_tensor = torch.tensor(X_array, dtype=torch.float32)
            with torch.no_grad():
                output = self.nn_model(X_tensor).detach().numpy()
            return float(output[0][0])
        else:
            X_df = pd.DataFrame(X_array, columns=self.feature_names)
            if model == "xgb":
                proba = self.xgb_model.predict_proba(X_df)[:, 1][0]
            elif model == "log":
                proba = self.log_model.predict_proba(X_df)[:, 1][0]
            else:
                raise ValueError("Invalid model type.")
            return float(proba)