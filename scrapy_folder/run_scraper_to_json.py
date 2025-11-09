"""
Run the scraper and save results to JSON file (no database required)
"""
import json
import os
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from scrapy_folder.spiders.dining_scraper import WorcesterMenuSpider

# Disable the pipeline for testing
settings = get_project_settings()
settings.set('ITEM_PIPELINES', {})  # Disable all pipelines

# Set output file
output_file = 'umass_menu.json'

# Delete old file if it exists to avoid appending
if os.path.exists(output_file):
    os.remove(output_file)

settings.set('FEEDS', {
    output_file: {
        'format': 'json',
        'encoding': 'utf8',
        'indent': 2,
        'overwrite': True,
    }
})

# Create a crawler process
process = CrawlerProcess(settings)

# Run the spider
print(f"Starting scraper...")
print(f"Output will be saved to: {output_file}")
process.crawl(WorcesterMenuSpider)
process.start()

print(f"\n✅ Scraping complete! Data saved to {output_file}")

# Load and display summary
with open(output_file, 'r', encoding='utf-8') as f:
    data = json.load(f)
    
print(f"\nTotal items scraped: {len(data)}")

# Count by category
categories = {}
for item in data:
    cat = item['category']
    categories[cat] = categories.get(cat, 0) + 1

print(f"\nItems by category:")
for cat, count in sorted(categories.items()):
    print(f"  {cat}: {count}")

# Show unique tags
all_tags = set()
for item in data:
    all_tags.update(item['tags'])

print(f"\nUnique dietary tags found: {sorted(all_tags)}")
