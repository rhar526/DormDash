import scrapy

class UmassMenuItem(scrapy.Item):
    """
    Defines the fields for a single menu item scraped from UMass Dining.
    """
    item_name = scrapy.Field()
    category = scrapy.Field()
    tags = scrapy.Field() # A list of dietary tags/icons (e.g., 'Vegan', 'Halal')
    location = scrapy.Field() # E.g., 'Worcester Dining Commons'