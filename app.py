from flask import Flask, render_template, request, jsonify
from utils import calculate_entropy, check_leaked
from model import predict_strength
import random
import string

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze_password():
    data = request.get_json()
    password = data.get("password", "")

    entropy = calculate_entropy(password)
    leaked = check_leaked(password)
    ai = predict_strength(entropy, len(password))

    return jsonify({
        "entropy": entropy,
        "leaked": leaked,
        "ai": ai
    })

@app.route("/generate")
def generate_password_route():
    characters = string.ascii_letters + string.digits + "!@#$%^&*()"
    password = ''.join(random.choice(characters) for _ in range(14))
    return jsonify({"password": password})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)