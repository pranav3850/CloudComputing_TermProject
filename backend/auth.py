from google.oauth2 import id_token
from google.auth.transport import requests
from flask import request, jsonify

CLIENT_ID = "188741106031-594vp108t12ahal7t4hv97fs0mjj81m3.apps.googleusercontent.com"
def verify_token():
    token = request.headers.get("Authorization")

    if not token:
        return None, jsonify({"error": "Missing token"}), 401

    try:
        token = token.replace("Bearer ", "")
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            CLIENT_ID
        )
        return idinfo["email"], None, None
    except Exception as e:
        print("Token verification failed:", e)
        return None, jsonify({"error": "Invalid token"}), 401
