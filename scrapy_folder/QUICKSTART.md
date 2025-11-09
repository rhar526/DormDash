# 🚀 Quick Start Guide

## Get the scraper running in 30 seconds!

### Step 1: Scrape the menu
```bash
python run_scraper_to_json.py
```

This will:
- Scrape all menu items from UMass Dining Worcester
- Save results to `umass_menu.json`
- Show you a summary of what was scraped

### Step 2: View the results
```bash
python view_menu.py
```

This displays the menu in a nice, readable format with:
- Items organized by category
- Dietary tags for each item
- Summary statistics

---

## That's it! 🎉

You now have all the menu data in `umass_menu.json`

---

## Want to do more?

### Run tests
```bash
python -m unittest test_scraper.py -v
```

### Test without saving
```bash
python test_spider_only.py
```

### Use with database
1. Edit `scrapy_folder/settings.py` with your database credentials
2. Run: `scrapy crawl worcester_menu`

---

## Files You'll Get

- **`umass_menu.json`** - All scraped menu data
- Console output with statistics and summaries

## What Gets Scraped

- ✅ Item names (e.g., "Chicken Congee", "Cheese Pizza")
- ✅ Categories (e.g., "Grill Station", "Pizza")
- ✅ Dietary tags (e.g., "Halal", "Vegan", "Gluten-Free")
- ✅ Location (Worcester Dining Commons)

---

**Need help?** Check `README.md` or `SUMMARY.md` for full documentation.
