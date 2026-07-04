from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import csv
import os

from recommendation import (
    get_recommendations,
    recommend_for_new_user
)

app = Flask(__name__)
CORS(app)

users = pd.read_csv("../dataset/users.csv")


@app.route("/")
def home():
    return "AI Recommendation System Running"


@app.route("/recommend/<int:user_id>")
def recommend(user_id):

    recommendations = get_recommendations(user_id)

    return jsonify(recommendations)


@app.route("/users")
def get_users():

    return jsonify(users.to_dict(orient="records"))


@app.route("/new-recommend", methods=["POST"])
def new_recommend():

    data = request.json

    # Name and age are received but NOT used for recommendations
    education = data.get("education", "")
    interests = data.get("interests", "")

    recommendations = recommend_for_new_user(
        education,
        interests
    )

    return jsonify(recommendations)


@app.route("/save-activity", methods=["POST"])
def save_activity():

    data = request.json

    file_path = "../dataset/user_activity.csv"

    # Create file if it doesn't exist
    if not os.path.exists(file_path):

        with open(file_path, "w", newline="") as file:

            writer = csv.writer(file)

            writer.writerow([
                "user_id",
                "name",
                "age",
                "education",
                "interests",
                "product_name",
                "action"
            ])

    # Read existing rows
    with open(file_path, "r", newline="") as file:

        rows = list(csv.reader(file))

    user_id = len(rows)

    # Save activity
    with open(file_path, "a", newline="") as file:

        writer = csv.writer(file)

        writer.writerow([
            user_id,
            data.get("name", ""),
            data.get("age", ""),
            data.get("education", ""),
            data.get("interests", ""),
            data.get("product_name", ""),
            data.get("action", "")
        ])

    return jsonify({
        "message": "Activity Saved Successfully"
    })


if __name__ == "__main__":
    app.run(debug=True)