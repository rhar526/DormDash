import psycopg2
from itemadapter import ItemAdapter
from scrapy.exceptions import DropItem
# CORRECTED IMPORT PATH
from scrapy_folder.items import UmassMenuItem

class PostgresPipeline:
    """
    Pipeline to store scraped items into a PostgreSQL database.
    """

    def __init__(self, host, database, user, password, port):
        # Database connection details are loaded from settings.py
        self.host = host
        self.database = database
        self.user = user
        self.password = password
        self.port = port
        self.conn = None
        self.cur = None

    @classmethod
    def from_crawler(cls, crawler):
        """Initializes the pipeline with settings from Scrapy."""
        return cls(
            host=crawler.settings.get('POSTGRES_HOST'),
            database=crawler.settings.get('POSTGRES_DB'),
            user=crawler.settings.get('POSTGRES_USER'),
            password=crawler.settings.get('POSTGRES_PASSWORD'),
            port=crawler.settings.get('POSTGRES_PORT')
        )

    def open_spider(self, spider):
        """Connects to the database and creates the table if it doesn't exist."""
        try:
            self.conn = psycopg2.connect(
                host=self.host,
                database=self.database,
                user=self.user,
                password=self.password,
                port=self.port
            )
            self.cur = self.conn.cursor()

            # Create the table
            self.cur.execute("""
                CREATE TABLE IF NOT EXISTS umass_menu (
                    id SERIAL PRIMARY KEY,
                    item_name TEXT NOT NULL,
                    category TEXT,
                    tags TEXT[],
                    location TEXT,
                    scraped_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
                )
            """)
            self.conn.commit()
            spider.logger.info("Successfully connected to PostgreSQL and ensured table exists.")

        except psycopg2.Error as e:
            spider.logger.error(f"Error connecting to PostgreSQL: {e}")
            raise DropItem(f"Database connection failed: {e}")

    def close_spider(self, spider):
        """Closes the database connection."""
        if self.cur:
            self.cur.close()
        if self.conn:
            self.conn.close()

    def process_item(self, item, spider):
        """Inserts the item data into the table."""
        adapter = ItemAdapter(item)
        
        # Convert the tags list to a string array format for PostgreSQL
        tags_list = adapter.get('tags', [])
        tags_array_string = '{' + ','.join(f'"{tag}"' for tag in tags_list) + '}'
        
        try:
            self.cur.execute(
                """
                INSERT INTO umass_menu (item_name, category, tags, location)
                VALUES (%s, %s, %s, %s)
                """,
                (
                    adapter['item_name'],
                    adapter['category'],
                    tags_array_string, # Pass the PostgreSQL array string
                    adapter['location']
                )
            )
            self.conn.commit()
            return item
        except psycopg2.Error as e:
            spider.logger.error(f"Error inserting item into database: {e}")
            self.conn.rollback()
            raise DropItem(f"Database insertion failed for item {adapter['item_name']}: {e}")