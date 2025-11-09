# UMass Dining Menu Scraper

A Scrapy-based web scraper for extracting menu information from the UMass Dining website.

## Features

- Scrapes menu items from Worcester Dining Commons
- Extracts item names, categories, and dietary tags (Halal, Vegan, Vegetarian, etc.)
- Stores data in PostgreSQL database
- Includes comprehensive unit tests

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure database settings in `scrapy_folder/settings.py`:
```python
POSTGRES_HOST = 'your_db_host'
POSTGRES_DB = 'your_database_name'
POSTGRES_USER = 'your_db_user'
POSTGRES_PASSWORD = 'your_db_password'
POSTGRES_PORT = 5432
```

## Usage

### Run the scraper (without database):
```bash
python test_spider_only.py
```

### Run the scraper (with database):
```bash
scrapy crawl worcester_menu
```

### Run from project directory:
```bash
cd scrapy_folder
scrapy crawl worcester_menu
```

## Project Structure

```
scrapy_folder/
├── scrapy_folder/
│   ├── spiders/
│   │   └── dining_scraper.py    # Main spider
│   ├── items.py                 # Item definitions
│   ├── pipeline.py              # PostgreSQL pipeline
│   ├── settings.py              # Scrapy settings
│   └── middlewares.py           # Middleware components
├── test_scraper.py              # Unit tests
├── test_spider_only.py          # Test without database
├── requirements.txt             # Dependencies
└── scrapy.cfg                   # Scrapy configuration
```

## Data Schema

The scraper extracts the following fields:

- **item_name**: Name of the menu item
- **category**: Category/station (e.g., "Grill Station", "Pizza")
- **tags**: List of dietary tags (e.g., ["Halal", "Vegetarian"])
- **location**: Dining location (default: "Worcester Dining Commons")

## Database Schema

The PostgreSQL table `umass_menu` has the following structure:

```sql
CREATE TABLE IF NOT EXISTS umass_menu (
    id SERIAL PRIMARY KEY,
    item_name TEXT NOT NULL,
    category TEXT,
    tags TEXT[],
    location TEXT,
    scraped_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
)
```

## Testing

Run unit tests:
```bash
python -m unittest test_scraper.py
```

## Current Status

✅ Spider correctly extracts all menu items (126 items as of Nov 8, 2025)
✅ Properly parses categories and dietary tags
✅ Database pipeline configured
✅ Unit tests included

## Notes

- The scraper respects robots.txt
- User agent is set to identify the scraper
- Data is scraped from: https://umassdining.com/locations-menus/worcester/menu
