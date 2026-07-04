import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# LOAD DATASETS

users = pd.read_csv("../dataset/users.csv")

products = pd.read_csv("../dataset/products.csv")

interactions = pd.read_csv("../dataset/interactions.csv")


# CREATE USER PROFILE

users["profile"] = (
    users["education"] + " " +
    users["interests"]
)


# CREATE USER BEHAVIOR

interaction_data = interactions.merge(
    products,
    on="product_id"
)

user_behavior = interaction_data.groupby(
    "user_id"
)["tags"].apply(
    lambda x: " ".join(x)
)


# ADD BEHAVIOR TO USERS

users["behavior"] = users["user_id"].map(
    user_behavior
)

users["behavior"] = users["behavior"].fillna("")


# FINAL PROFILE

users["final_profile"] = (
    users["profile"] + " " +
    users["behavior"]
)


# TF-IDF

vectorizer = TfidfVectorizer()

product_vectors = vectorizer.fit_transform(
    products["tags"]
)

user_vectors = vectorizer.transform(
    users["final_profile"]
)


# COSINE SIMILARITY

similarity = cosine_similarity(
    user_vectors,
    product_vectors
)


# EXISTING USER RECOMMENDATION

def get_recommendations(user_id):

    user_index = users[
        users["user_id"] == user_id
    ].index[0]

    scores = similarity[user_index]

    sorted_indices = scores.argsort()[::-1]

    top_products = sorted_indices[:3]

    recommendations = []

    for index in top_products:

        recommendations.append({
            "product_name": products.iloc[index]["product_name"],
            "category": products.iloc[index]["category"],
            "image": products.iloc[index]["image"],
            "score": round(float(scores[index]), 2)
        })

    return recommendations


# NEW USER RECOMMENDATION

def recommend_for_new_user(education, interests):

    profile = education + " " + interests

    user_vector = vectorizer.transform([profile])

    scores = cosine_similarity(
        user_vector,
        product_vectors
    )[0]

    sorted_indices = scores.argsort()[::-1]

    top_products = sorted_indices[:3]

    recommendations = []

    for index in top_products:

        recommendations.append({
            "product_name": products.iloc[index]["product_name"],
            "category": products.iloc[index]["category"],
            "image": products.iloc[index]["image"],
            "score": round(float(scores[index]), 2)
        })

    return recommendations