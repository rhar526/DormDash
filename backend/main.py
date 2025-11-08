from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)
@app.route("/")
def home():
    return "Flask is running! Go to /api/users"

@app.route("/api/users", methods = ['GET'])
def users():
    return jsonify(
        {
            "users" : [
                "Rayaan",
                "Dylan",
                "Fardeen"
            ]
        }
    )

if __name__ == "__main__":
    app.run(debug=True, port = 8080)