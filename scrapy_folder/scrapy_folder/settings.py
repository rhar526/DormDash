# Scrapy settings for scrapy_folder project
BOT_NAME = 'scrapy_folder'

SPIDER_MODULES = ['scrapy_folder.spiders']
NEWSPIDER_MODULE = 'scrapy_folder.spiders'

# Obey robots.txt rules
ROBOTSTXT_OBEY = True

# Configure Item Pipelines
# The path must use 'scrapy_folder' now.
ITEM_PIPELINES = {
    'scrapy_folder.pipelines.PostgresPipeline': 300,
}

# --- PostgreSQL Database Settings (MUST UPDATE) ---
# Replace these with your actual database credentials
POSTGRES_HOST = 'your_db_host'
POSTGRES_DB = 'your_database_name'
POSTGRES_USER = 'your_db_user'
POSTGRES_PASSWORD = 'your_db_password'
POSTGRES_PORT = 5432 # Default PostgreSQL port

# Example User Agent (good practice)
USER_AGENT = 'UMassDiningScraper (+http://www.yourwebsite.com)'