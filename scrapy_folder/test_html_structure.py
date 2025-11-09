import requests
from bs4 import BeautifulSoup

url = "https://umassdining.com/locations-menus/worcester/menu"
response = requests.get(url)

soup = BeautifulSoup(response.content, 'html.parser')

print("=== Testing complete extraction ===\n")

# Find all menu items with lightbox-nutrition class
menu_items = soup.find_all('li', class_='lightbox-nutrition')
print(f"Found {len(menu_items)} menu items total\n")

# Test extraction on first few items
for i, item in enumerate(menu_items[:5]):
    link = item.find('a')
    if link:
        item_name = link.get_text().strip()
        tags_str = link.get('data-clean-diet-str', '')
        tags = [tag.strip() for tag in tags_str.split(',') if tag.strip()]
        
        print(f"Item {i}: {item_name}")
        print(f"  Tags: {tags}")
        print()

print("\n=== Testing full scraper logic ===\n")
headers = soup.find_all('h2')
total_items = 0

for header in headers:
    category = header.get_text().strip()
    if not category or category in ['', 'Lunch', 'Dinner', 'Breakfast', 'Nutrition Facts']:
        continue
    
    # Find all items for this category
    items_found = []
    for sibling in header.find_next_siblings():
        if sibling.name == 'h2':
            break
        if sibling.name == 'li' and 'lightbox-nutrition' in sibling.get('class', []):
            link = sibling.find('a')
            if link:
                item_name = link.get_text().strip()
                tags_str = link.get('data-clean-diet-str', '')
                tags = [tag.strip() for tag in tags_str.split(',') if tag.strip()]
                items_found.append((item_name, tags))
    
    if items_found:
        print(f"Category: {category} ({len(items_found)} items)")
        for name, tags in items_found[:2]:
            print(f"  - {name} {tags}")
        total_items += len(items_found)

print(f"\nTotal items scraped: {total_items}")
