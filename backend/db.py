from dotenv import load_dotenv
import os
from pathlib import Path
import psycopg2  #

load_dotenv(dotenv_path=Path('.') / '.env')

def get_db_connection():
    print("🎯 DB NAME:", os.getenv("DB_NAME"))  # debug log

    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )
