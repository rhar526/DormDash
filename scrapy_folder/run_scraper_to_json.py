import os
import json
import datetime
import psycopg2
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from scrapy_folder.spiders.dining_scraper import WorcesterMenuSpider

# ---------- DATABASE CONFIG ----------
DB_CONFIG = {
    "host": "localhost",
    "dbname": "dormdasherv2",
    "user": "postgres",
    "password": "RDF_Dorm_Dash",
    "port": 5432,
}

# ---------- SCRAPY CONFIG ----------
output_file = 'umass_menu.json'

# Remove old file
if os.path.exists(output_file):
    os.remove(output_file)

settings = get_project_settings()
settings.set('ITEM_PIPELINES', {})  # Disable pipelines
settings.set('FEEDS', {
    output_file: {
        'format': 'json',
        'encoding': 'utf8',
        'indent': 2,
        'overwrite': True,
    }
})

# ---------- RUN SCRAPER ----------
print("🕷️ Starting scraper...")
process = CrawlerProcess(settings)
process.crawl(WorcesterMenuSpider)
process.start()
print(f"\n✅ Scraping complete! Data saved to {output_file}")

# ---------- LOAD JSON ----------
with open(output_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"\nTotal items scraped: {len(data)}")

# ---------- CONNECT TO POSTGRES ----------
print("🗄️ Connecting to local PostgreSQL...")
conn = psycopg2.connect(
    host=DB_CONFIG["host"],
    dbname=DB_CONFIG["dbname"],
    user=DB_CONFIG["user"],
    password=DB_CONFIG["password"],
    port=DB_CONFIG["port"]
)
cursor = conn.cursor()

# ---------- HELPER FUNCTIONS ----------
def get_hall_id(hall_name: str):
    cursor.execute("SELECT id FROM dining_halls WHERE name = %s", (hall_name,))
    result = cursor.fetchone()
    if result:
        return result[0]
    # Insert new hall if it doesn't exist
    cursor.execute("INSERT INTO dining_halls(name) VALUES(%s) RETURNING id", (hall_name,))
    conn.commit()
    new_result = cursor.fetchone()
    if new_result:
        return new_result[0]
    raise RuntimeError(f"Failed to insert hall: {hall_name}")


def clear_today_menu():
    cursor.execute("DELETE FROM menu_items")
    conn.commit()
    print("🗑️ Cleared old menu items.")


def insert_menu_item(item):
    hall_name = item.get('location') or item.get('hall') or "Unknown"
    # Prepare arrays for Postgres
    tags = item.get('tags') or []
    tags = [t.strip() for t in tags if t and t.lower() != 'none']

    dietary_info = item.get('dietary_info') or item.get('dietary') or []
    dietary_info = [d.strip() for d in dietary_info if d and d.lower() != 'none']

    cursor.execute("""
        INSERT INTO menu_items (item_name, calories, tags, dietary_info, category, location, hall)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT DO NOTHING
    """, (
        item.get('item_name') or item.get('name'),
        item.get('calories'),
        tags if tags else None,
        dietary_info if dietary_info else None,
        item.get('category', 'Uncategorized'),
        item.get('location', 'Unknown'),
        hall_name
    ))
    conn.commit()


# ---------- CLEAR OLD DATA ----------
clear_today_menu()

# ---------- INSERT DATA ----------
print("\n🍽️ Uploading scraped items to database...")
inserted = 0
skipped = 0

for item in data:
    name = item.get('item_name') or item.get('name')
    if not name or name.strip() == "":
        print(f"⚠️ Skipping item with missing name: {item}")
        skipped += 1
        continue
    try:
        insert_menu_item(item)
        inserted += 1
    except Exception as e:
        print(f"⚠️ Error inserting {name}: {e}")
        conn.rollback()

print(f"✅ Successfully uploaded {inserted} items.")
print(f"⚠️ Skipped {skipped} items due to missing names.")

# ---------- DISPLAY SUMMARY ----------
categories = {}
all_tags = set()

for item in data:
    cat = item.get('category', 'Uncategorized')
    categories[cat] = categories.get(cat, 0) + 1

    tags = item.get('tags') or []
    tags = [t.strip() for t in tags if t and t.lower() != 'none']
    all_tags.update(tags)

print("\n📊 Items by category:")
for cat, count in sorted(categories.items()):
    print(f"  {cat}: {count}")

print(f"\n🏷️ Unique dietary tags found: {sorted(all_tags)}")

# ---------- CLEANUP ----------
cursor.close()
conn.close()
print("\n🚀 Done!")
