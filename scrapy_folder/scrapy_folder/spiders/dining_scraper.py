import scrapy
from scrapy_folder.items import UmassMenuItem

class WorcesterMenuSpider(scrapy.Spider):
    """
    Spider to scrape the menu from the UMass Dining Worcester location.
    
    The actual structure of the site:
    - Categories are marked with <h2> tags
    - Menu items are in <li class="lightbox-nutrition"> elements
    - Item names are in <a> tags within the <li>
    - Dietary tags are in the data-clean-diet-str attribute
    """
    name = 'worcester_menu'
    allowed_domains = ['umassdining.com']
    start_urls = ['https://umassdining.com/locations-menus/worcester/menu']
    location_name = 'Worcester Dining Commons'

    def parse(self, response):
        # Find all h2 headers which represent categories
        headers = response.css('h2')
        
        for header in headers:
            category_name = header.css('::text').get()
            
            if not category_name:
                continue
            
            category_name = category_name.strip()
            
            # Skip non-menu headers
            if category_name in ['', 'Lunch', 'Dinner', 'Breakfast', 'Nutrition Facts']:
                continue
            
            # Find all menu items following this header until the next h2
            # We need to iterate through siblings
            current = header
            while True:
                current = current.xpath('following-sibling::*[1]')
                if not current:
                    break
                
                # Stop if we hit another h2
                if current.xpath('self::h2'):
                    break
                
                # Check if this is a menu item
                if current.xpath('self::li[contains(@class, "lightbox-nutrition")]'):
                    # Extract item information
                    link = current.css('a')
                    if link:
                        item_name = link.css('::text').get()
                        if item_name:
                            item_name = item_name.strip()
                            
                            # Extract dietary tags from data attribute
                            tags_str = link.xpath('@data-clean-diet-str').get()
                            tags = []
                            if tags_str:
                                tags = [tag.strip() for tag in tags_str.split(',') if tag.strip()]
                            
                            # Create and yield the menu item
                            menu_item = UmassMenuItem()
                            menu_item['item_name'] = item_name
                            menu_item['category'] = category_name
                            menu_item['tags'] = tags
                            menu_item['location'] = self.location_name
                            
                            yield menu_item