import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.linear_model import LogisticRegression
import xgboost as xgb
import joblib

# ----------------------------
# 1) Load and preprocess data
# ----------------------------

df = pd.read_csv("synthetic_student_admission_data.csv")

# Create 'Same_Stream' feature
df["Same_Stream"] = (df["School_Stream"] == df["College_Stream"]).astype(int)

# Drop original 'School_Stream' and 'College_Stream'
df.drop(columns=["School_Stream", "College_Stream"], inplace=True)

# Encode 'Category' with a label encoder (we’ll save this for inference)
category_encoder = LabelEncoder()
df["Category"] = category_encoder.fit_transform(df["Category"])

# Enforce a column order for X that matches how we'll do inference
# => [Marks_12th, Same_Stream, Category]
feature_order = ["Marks_12th", "Same_Stream", "Category"]
X = df[feature_order]
y = df["Admission_Probability"].apply(lambda x: 1 if x >= 0.5 else 0)

print("\nFeatures in X:", X.columns.to_list())
print("Number of features:", X.shape[1])  # Expect 3

# --------------------------
# 2) Train-test split
# --------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ---------------------------------
# 3) Standardize 'Marks_12th' only
# ---------------------------------
# We'll also save this scaler for inference
scaler = StandardScaler()
X_train[["Marks_12th"]] = scaler.fit_transform(X_train[["Marks_12th"]])
X_test[["Marks_12th"]] = scaler.transform(X_test[["Marks_12th"]])

# ----------------------------------
# 4) Define the NeuralNet class
# ----------------------------------
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

# -------------------------------
# 5) Train the Neural Network
# -------------------------------
X_train_tensor = torch.tensor(X_train.values, dtype=torch.float32)
X_test_tensor  = torch.tensor(X_test.values,  dtype=torch.float32)
y_train_tensor = torch.tensor(y_train.values, dtype=torch.float32).view(-1, 1)
y_test_tensor  = torch.tensor(y_test.values,  dtype=torch.float32).view(-1, 1)

nn_model = NeuralNet(input_size=X_train.shape[1])  # Should be 3
criterion = nn.BCELoss()
optimizer = optim.Adam(nn_model.parameters(), lr=0.01)

epochs = 100
for epoch in range(epochs):
    optimizer.zero_grad()
    outputs = nn_model(X_train_tensor)
    loss = criterion(outputs, y_train_tensor)
    loss.backward()
    optimizer.step()

    if epoch % 20 == 0:
        print(f"Epoch [{epoch}/{epochs}], Loss: {loss.item():.4f}")

nn_model.eval()
y_pred_nn = nn_model(X_test_tensor).detach().numpy()
y_pred_nn = (y_pred_nn >= 0.5).astype(int).flatten()

print("\n[Neural Network Metrics]")
print(f"Accuracy:  {accuracy_score(y_test, y_pred_nn):.4f}")
print(f"Precision: {precision_score(y_test, y_pred_nn):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred_nn):.4f}")
print(f"F1 Score:  {f1_score(y_test, y_pred_nn):.4f}")

# Save the NN model
torch.save(nn_model.state_dict(), "nn_model.pth")

# ------------------------
# 6) Train XGBoost Model
# ------------------------
xgb_model = xgb.XGBClassifier(n_estimators=100, learning_rate=0.1)
xgb_model.fit(X_train, y_train)

y_pred_xgb = xgb_model.predict(X_test)
print("\n[XGBoost Metrics]")
print(f"Accuracy:  {accuracy_score(y_test, y_pred_xgb):.4f}")
print(f"Precision: {precision_score(y_test, y_pred_xgb):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred_xgb):.4f}")
print(f"F1 Score:  {f1_score(y_test, y_pred_xgb):.4f}")

# Save XGBoost
xgb_model.save_model("xgb_model.json")

# ---------------------------------
# 7) Train Logistic Regression
# ---------------------------------
log_model = LogisticRegression()
log_model.fit(X_train, y_train)

y_pred_log = log_model.predict(X_test)
print("\n[Logistic Regression Metrics]")
print(f"Accuracy:  {accuracy_score(y_test, y_pred_log):.4f}")
print(f"Precision: {precision_score(y_test, y_pred_log):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred_log):.4f}")
print(f"F1 Score:  {f1_score(y_test, y_pred_log):.4f}")

# Save Logistic Regression
joblib.dump(log_model, "log_model.pkl")

# ----------------
# 8) Save Scalers
# ----------------
joblib.dump(scaler, "marks_scaler.pkl")
joblib.dump(category_encoder, "category_label_encoder.pkl")

print("\nAll models and encoders trained/saved successfully.")
