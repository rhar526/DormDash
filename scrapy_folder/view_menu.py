"""
Simple script to view the scraped menu data in a readable format
"""
import json
import os

json_file = 'umass_menu.json'

if not os.path.exists(json_file):
    print(f"❌ File '{json_file}' not found!")
    print(f"Run 'python run_scraper_to_json.py' first to scrape the data.")
    exit(1)

# Load the data
with open(json_file, 'r', encoding='utf-8') as f:
    menu_items = json.load(f)

print("=" * 80)
print("UMASS DINING - WORCESTER MENU")
print("=" * 80)
print(f"\nTotal Items: {len(menu_items)}\n")

# Group by category
categories = {}
for item in menu_items:
    cat = item['category']
    if cat not in categories:
        categories[cat] = []
    categories[cat].append(item)

# Display by category
for category in sorted(categories.keys()):
    print(f"\n{'=' * 80}")
    print(f"📍 {category.upper()} ({len(categories[category])} items)")
    print('=' * 80)
    
    for item in categories[category]:
        tags_str = ', '.join(item['tags']) if item['tags'] else 'No tags'
        print(f"  • {item['item_name']}")
        if item['tags'] and item['tags'] != ['None']:
            print(f"    🏷️  {tags_str}")
        print()

# Summary statistics
print("\n" + "=" * 80)
print("SUMMARY STATISTICS")
print("=" * 80)

# Count items by category
print("\n📊 Items per Category:")
for cat in sorted(categories.keys()):
    print(f"  {cat}: {len(categories[cat])}")

# Count dietary tags
tag_counts = {}
for item in menu_items:
    for tag in item['tags']:
        if tag != 'None':
            tag_counts[tag] = tag_counts.get(tag, 0) + 1

print("\n🏷️  Dietary Tag Frequency:")
for tag, count in sorted(tag_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"  {tag}: {count} items")

print("\n" + "=" * 80)
