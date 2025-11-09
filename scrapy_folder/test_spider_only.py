"""
Test script to run the spider without database connection
"""
import sys
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings

# Disable the pipeline for testing
settings = get_project_settings()
settings.set('ITEM_PIPELINES', {})  # Disable all pipelines

# Import the spider
from scrapy_folder.spiders.dining_scraper import WorcesterMenuSpider

# Create a crawler process
process = CrawlerProcess(settings)

# Track items
items_scraped = []

def item_scraped(item, response, spider):
    items_scraped.append(item)
    print(f"Scraped: {item['item_name']} | Category: {item['category']} | Tags: {item['tags']}")

# Connect to the signal
from scrapy import signals
from scrapy.signalmanager import dispatcher

dispatcher.connect(item_scraped, signal=signals.item_scraped)

# Run the spider
process.crawl(WorcesterMenuSpider)
process.start()

print(f"\n\n=== SUMMARY ===")
print(f"Total items scraped: {len(items_scraped)}")

# Show some statistics
categories = {}
for item in items_scraped:
    cat = item['category']
    categories[cat] = categories.get(cat, 0) + 1

print(f"\nItems by category:")
for cat, count in sorted(categories.items()):
    print(f"  {cat}: {count}")
