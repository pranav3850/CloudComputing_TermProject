from flask import Blueprint, request, jsonify
from db import get_db_connection
from auth import verify_token

favorites_bp = Blueprint('favorites', __name__)

@favorites_bp.route('/', methods=['GET'])
@favorites_bp.route('', methods=['GET'])
def get_favorites():
    email, err, code = verify_token()
    if err:
        print("❌ Token verification failed:", err)
        return jsonify({"error": "Invalid token"}), code

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT city_name FROM public.favorites WHERE user_email = %s", (email,))
        cities = [row[0] for row in cur.fetchall()]
        cur.close()
        conn.close()

        print("✅ Retrieved cities for", email, ":", cities)
        return jsonify(cities)

    except Exception as e:
        print("🔥 DB error in /api/favorites:", e)
        return jsonify({"error": "Failed to fetch favorites"}), 500

@favorites_bp.route('/', methods=['POST'])
def add_favorite():
    email, err, code = verify_token()
    if err: return err, code

    try:
        data = request.get_json()
        city = data.get("city")
        if not city:
            return jsonify({"error": "City is required"}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        # 🔍 Check if already exists
        cur.execute(
            "SELECT * FROM favorites WHERE user_email = %s AND city_name = %s",
            (email, city)
        )
        exists = cur.fetchone()

        if exists:
            cur.close()
            conn.close()
            return jsonify({"message": f"{city} is already in your favorites."}), 200

        # ✅ Insert if not already there
        cur.execute(
            "INSERT INTO favorites (user_email, city_name) VALUES (%s, %s)",
            (email, city)
        )
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": f"{city} added to favorites."}), 201

    except Exception as e:
        print("🔥 Error adding to favorites:", e)
        return jsonify({"error": "Failed to add favorite"}), 500


# ✅ Delete a favorite city
@favorites_bp.route('/<city>', methods=['DELETE'])

def delete_favorite(city):
    email, err, code = verify_token()
    if err: return err, code

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM favorites WHERE user_email = %s AND city_name = %s", (email, city))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": f"{city} removed from favorites"}), 200
