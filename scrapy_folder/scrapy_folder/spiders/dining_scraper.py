import scrapy
# CORRECTED IMPORT PATH
from scrapy_folder.items import UmassMenuItem

class WorcesterMenuSpider(scrapy.Spider):
    """
    Spider to scrape the menu from the UMass Dining Worcester location.
    
    The structure of the menu on the target site is generally:
    - Main container elements for sections like 'Lunch', 'Dinner'.
    - Nested containers for dining stations/categories (e.g., 'Global Cuisine').
    - Individual item containers within the stations.
    """
    name = 'worcester_menu'
    allowed_domains = ['umassdining.com']
    start_urls = ['https://umassdining.com/locations-menus/worcester/menu']
    location_name = 'Worcester Dining Commons'

    def parse(self, response):
        # 1. Target the main content area where the menu is displayed
        # We look for all 'menu-block' containers, which typically represent a station/category.
        # This selector is based on common class names for structured content:
        menu_stations = response.css('div.menu-block')

        for station in menu_stations:
            # 2. Extract the Category/Station Name (e.g., 'Simple Servings', 'Wok')
            # Assuming the station name is in an h2 or similar tag within the station block
            category_name = station.css('h2::text').get()
            
            if not category_name:
                continue # Skip if we can't find a category name
            
            # Clean up the category name
            category_name = category_name.strip()

            # 3. Find all individual menu items within this station
            # Assuming individual items are contained within a div with class 'menu-item-row'
            menu_items = station.css('div.menu-item-row')
            
            for item_row in menu_items:
                # 4. Extract the Item Name
                # Assuming the item name is in an element with class 'item-title' or similar
                item_name = item_row.css('h3.item-title::text').get() or item_row.css('h4.item-title::text').get()
                
                if not item_name:
                    continue # Skip if no item name is found
                
                item_name = item_name.strip()
                
                # 5. Extract Tags (Dietary Icons)
                # Tags are often represented by small images or spans with a title attribute.
                # Example: <img title="Vegan" ...> or <span class="tag-icon" title="Halal">
                # We target any element with a 'title' attribute that resides in a specific tag container
                tag_titles = item_row.css('img.icon[title]::attr(title)').getall()
                tag_titles.extend(item_row.css('span.tag-icon[title]::attr(title)').getall())

                # 6. Create and yield the UmassMenuItem
                menu_item = UmassMenuItem()
                menu_item['item_name'] = item_name
                menu_item['category'] = category_name
                menu_item['tags'] = [t.strip() for t in tag_titles if t.strip()]
                menu_item['location'] = self.location_name
                
                yield menu_item