import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import joblib
import xgboost as xgb
import os

# 1) Define the PyTorch model architecture
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

# 2) Define AI Engine class
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
        # Must match the training script's input size (3 features)
        model = NeuralNet(input_size=3)
        # Pass weights_only=True to avoid the future pickle warning (requires PyTorch >= 2.0)
        state_dict = torch.load(
            os.path.join(self.base_dir, "nn_model.pth"),
            weights_only=True
        )
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
        """
        Predict method that takes four parameters separately:
          1) marks_12th       : numeric (e.g. 85)
          2) school_stream    : string label (e.g. 'Science')
          3) college_stream   : string label (e.g. 'Commerce')
          4) category         : numeric or label-encoded (e.g. 2)
        
        The code computes Same_Stream, then forms [marks_12th, Same_Stream, category].
        """
        
        # Determine if the streams match
        same_stream = 1 if school_stream.strip().lower() == college_stream.strip().lower() else 0
        
        # Create the final array
        X_array = np.array([float(marks_12th), same_stream, float(category)]).reshape(1, -1)
        
        if X_array.shape[1] != 3:
            raise ValueError(f"Invalid input shape: {X_array.shape}. Expected (1, 3).")

        if model == "nn":
            # Predict using PyTorch model
            X_tensor = torch.tensor(X_array, dtype=torch.float32)
            output = self.nn_model(X_tensor).detach().numpy()
            probability = output[0][0]
            return 1 if probability >= 0.5 else 0
        
        else:
            # Convert to a DataFrame with valid column names for sklearn/XGBoost
            X_df = pd.DataFrame(X_array, columns=self.feature_names)

            if model == "xgb":
                pred = self.xgb_model.predict(X_df)
                return int(pred[0])
            
            elif model == "log":
                pred = self.log_model.predict(X_df)
                return int(pred[0])
            
            else:
                raise ValueError("Invalid model type. Choose from 'nn', 'xgb', or 'log'.")


# --------------------------
# Example usage
# --------------------------
if __name__ == "__main__":
    engine = AiEngine()

    # Provide 4 values in a natural format:
    #  1) marks_12th     => e.g. 85
    #  2) school_stream  => e.g. "Science"
    #  3) college_stream => e.g. "Commerce"
    #  4) category       => numeric or label-encoded (e.g. 2)
    prediction_nn  = engine.predict(85, "Science", "Commerce", 2, model="nn")
    prediction_xgb = engine.predict(85, "Science", "Commerce", 2, model="xgb")
    prediction_log = engine.predict(85, "Science", "Commerce", 2, model="log")
    
    print(f"Neural Network Prediction:  {prediction_nn}")
    print(f"XGBoost Prediction:         {prediction_xgb}")
    print(f"Logistic Regression:        {prediction_log}")
