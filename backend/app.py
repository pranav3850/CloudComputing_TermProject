from flask import Flask
from flask_cors import CORS
from db import get_db_connection
from routes.favorites import favorites_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/dbtest')
def test_db():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT NOW();")
    result = cur.fetchone()
    cur.close()
    conn.close()
    return {"db_time": result[0]}
app.register_blueprint(favorites_bp, url_prefix='/api/favorites')
if __name__ == '__main__':
    app.run(debug=True)
