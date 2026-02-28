import numpy as np
from sklearn.ensemble import RandomForestClassifier

X = np.array([
    [10, 4], [20, 6], [30, 8],
    [60, 10], [80, 12], [100, 16]
])

y = np.array([0, 0, 0, 1, 1, 1])

model = RandomForestClassifier()
model.fit(X, y)

def predict_strength(entropy, length):
    result = model.predict([[entropy, length]])
    return "Strong" if result[0] == 1 else "Weak"