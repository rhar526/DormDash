import psycopg2
from flask import Flask, jsonify, request
import datetime
import requests
import json


# --- Database Connection ---
def get_db_connection():
    conn = psycopg2.connect(
        dbname="dormdasher",
        user="postgres",        # replace with your username
        password="yourpassword",  # replace with your password
        host="localhost",
        port="5432"
    )
    return conn

# ---Scraper---
def get_umass_menu(hall="worcester", date=None):
    if date is None:
        date = datetime.date.today().strftime("%Y-%m-%d")
    
    url = f"https://umassdining.nutrislice.com/menu/api/weeks/school-umass-dining/menu-type-lunch/{hall}/{date}/"
    res = requests.get(url)
    data = res.json()
    return data

# ---Scrape + Upload ---
def scrape_and_upload():
    today = datetime.date.today().strftime("%Y-%m-%d")
    halls = ["worcester", "berkshire", "franklin", "hampshire"]

    conn = get_db_connection()
    cur = conn.cursor()

    for hall in halls:
        
        cur.execute(""" 
                    INSERT INTO dining_halls (name)
                    VALUES (%s)
                    ON CONFLICT (name) DO NOTHING;
                    """,(hall))
        
        cur.execute("SELECT id FROM dining_halls WHERE name = %s;", (hall,))
        hall_row = cur.fetchone()
        if not hall_row:
            continue  
        hall_id = hall_row[0]
        

        url = f"https://umassdining.nutrislice.com/menu/api/weeks/school-umass-dining/menu-type-lunch/{hall}/{today}/"
        res = requests.get(url)
        data = res.json()

        # Looping through days -> menu items
        for day in data.get("days" , []):
            meal_type = day.get("day_name", "Unknown")
            for meal in day.get("menu_items", []):
                name = meal.get("food_name", "Unknown")
                nutrition = json.dumps(meal.get("nutrition", {}))
                allergens = json.dumps(meal.get("allergens", []))

                cur.execute("""
                    INSERT INTO menu_items (hall_id, meal_type, name, nutrition, allergens, date)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT DO NOTHING;
                """, (hall_id, meal_type, name, nutrition, allergens, today))

    conn.commit()
    cur.close()
    conn.close()
    print("Menu data successfully updated in PostgreSQL!")


# --- Flask API ---
app = Flask(__name__)

@app.route("/menu")
def get_menu():
    hall = request.args.get("hall")
    meal = request.args.get("meal")
    date = request.args.get("date")

    conn = get_db_connection()
    cur = conn.cursor()

    query = """
        SELECT menu_items.name, dining_halls.name AS hall, meal_type, date, nutrition, allergens
        FROM menu_items
        JOIN dining_halls ON menu_items.hall_id = dining_halls.id
        WHERE 1=1
    """
    params = []

    if hall:
        query += " AND LOWER(dining_halls.name) = LOWER(%s)"
        params.append(hall)
    if meal:
        query += " AND LOWER(menu_items.meal_type) = LOWER(%s)"
        params.append(meal)
    if date:
        query += " AND menu_items.date = %s"
        params.append(date)

    cur.execute(query, params)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    keys = ["name", "hall", "meal_type", "date", "nutrition", "allergens"]
    items = [dict(zip(keys, row)) for row in rows]
    return jsonify(items)


if __name__ == "__main__":
    scrape_and_upload()
    app.run(debug=True)


                

            




