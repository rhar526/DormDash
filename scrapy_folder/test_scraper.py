import unittest
from unittest.mock import patch, MagicMock, Mock
import sys

# --- Mocking external dependencies FIRST ---
# We need to mock psycopg2 BEFORE any imports that use it
mock_psycopg2 = MagicMock()
mock_psycopg2.Error = Exception  # Mock the Error class
sys.modules['psycopg2'] = mock_psycopg2

# --- Import Scrapy components and your project files ---
from scrapy.crawler import Crawler
from scrapy.settings import Settings
from scrapy.exceptions import DropItem
from scrapy.http import Response
from scrapy.item import Item
from itemadapter import ItemAdapter

# IMPORTANT: Adjust these imports if your test file location changes!
from scrapy_folder.pipeline import PostgresPipeline
from scrapy_folder.spiders.dining_scraper import WorcesterMenuSpider
from scrapy_folder.items import UmassMenuItem


# ====================================================================
# TEST SUITE 1: PostgresPipeline Testing
# ====================================================================

class PostgresPipelineTest(unittest.TestCase):
    
    def setUp(self):
        # 1. Define a Mock Spider Class (This is the robust fix)
        # We define a static method 'update_settings' that correctly accepts 
        # both the class (cls) and settings arguments, preventing the TypeError.
        class MockSpider:
            name = 'mock_spider' # Scrapy often expects a name
            @classmethod
            def update_settings(cls, settings):
                # We don't need to do anything, just accept the arguments
                pass 
        
        # 2. Setup mock settings for the crawler
        self.mock_settings = Settings({
            'POSTGRES_HOST': 'test_host',
            'POSTGRES_DB': 'test_db',
            'POSTGRES_USER': 'test_user',
            'POSTGRES_PASSWORD': 'test_password',
            'POSTGRES_PORT': 5432
        })
        
        # 3. Setup mock Scrapy objects
        # PASS THE DEFINED MockSpider CLASS HERE
        self.mock_crawler = Crawler(MockSpider, self.mock_settings) 
        self.mock_spider = MagicMock()
        self.mock_spider.logger = MagicMock() 
        
        # 4. Create a clean pipeline instance using from_crawler
        self.pipeline = PostgresPipeline.from_crawler(self.mock_crawler)
        
    def tearDown(self):
        # Reset mocks if necessary
        mock_psycopg2.connect.reset_mock()
        mock_psycopg2.connect.side_effect = None

    def test_from_crawler_initialization(self):
        """Test that the pipeline correctly pulls settings."""
        self.assertEqual(self.pipeline.host, 'test_host')
        self.assertEqual(self.pipeline.port, 5432)

    def test_open_spider_success(self):
        """Test successful database connection and table creation."""
        
        # Configure the mock connection object
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_psycopg2.connect.return_value = mock_conn
        
        self.pipeline.open_spider(self.mock_spider)
        
        # Assert connection was called with correct parameters
        mock_psycopg2.connect.assert_called_once_with(
            host='test_host',
            database='test_db',
            user='test_user',
            password='test_password',
            port=5432
        )
        
        # Assert cursor was used to execute the CREATE TABLE command and commit
        self.assertTrue(mock_cursor.execute.call_count >= 1) # Must execute CREATE TABLE
        mock_conn.commit.assert_called_once()
        self.assertIsNotNone(self.pipeline.conn)

    def test_open_spider_failure(self):
        """Test database connection failure raises DropItem."""
        # Make the connection attempt raise a connection error
        mock_psycopg2.connect.side_effect = Exception("Auth failed")
        
        with self.assertRaises(DropItem):
            self.pipeline.open_spider(self.mock_spider)
            
    def test_close_spider(self):
        """Test that connection and cursor are closed."""
        self.pipeline.cur = MagicMock()
        self.pipeline.conn = MagicMock()
        
        self.pipeline.close_spider(self.mock_spider)
        
        self.pipeline.cur.close.assert_called_once()
        self.pipeline.conn.close.assert_called_once()

    def test_process_item_insertion_success(self):
        """Test successful item insertion and data formatting."""
        
        # Manually set up mock connection and cursor (as if open_spider ran)
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        self.pipeline.conn = mock_conn 
        self.pipeline.cur = mock_cursor
        
        # Mock Item object (using a real Item to test ItemAdapter)
        mock_item = UmassMenuItem(
            item_name='Test Steak', 
            category='Grill', 
            tags=['Gluten-Free', 'Halal'], 
            location='Worcester'
        )

        result_item = self.pipeline.process_item(mock_item, self.mock_spider)

        # 1. Assert the INSERT query was called exactly once
        self.assertEqual(mock_cursor.execute.call_count, 1)

        # 2. Extract and assert the execution arguments (Checking array formatting)
        args, kwargs = mock_cursor.execute.call_args
        
        # The third argument in the VALUES tuple must be the PostgreSQL array string: '{"Gluten-Free","Halal"}'
        expected_sql_values = ('Test Steak', 'Grill', '{"Gluten-Free","Halal"}', 'Worcester')

        self.assertEqual(args[1], expected_sql_values) 
        
        # 3. Assert commit was called
        mock_conn.commit.assert_called_once()
        
        # 4. Assert the original item was returned
        self.assertEqual(result_item, mock_item)
        
    def test_process_item_insertion_failure(self):
        """Test database insertion failure raises DropItem and rolls back."""
        
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        self.pipeline.conn = mock_conn 
        self.pipeline.cur = mock_cursor
        
        # Make the execute call fail
        mock_cursor.execute.side_effect = Exception("Constraint violation")
        
        mock_item = UmassMenuItem(item_name='Bad Item', category='Test', tags=[], location='Test')

        with self.assertRaises(DropItem):
            self.pipeline.process_item(mock_item, self.mock_spider)
        
        # Assert rollback was called
        mock_conn.rollback.assert_called_once()


# ====================================================================
# TEST SUITE 2: WorcesterMenuSpider Testing
# ====================================================================

class WorcesterMenuSpiderTest(unittest.TestCase):
    
    def setUp(self):
        self.spider = WorcesterMenuSpider()

    def test_parse_menu_items_extraction(self):
        """Tests the extraction of item_name, category, and tags from mock HTML."""
        
        # Mock HTML content that matches the actual structure
        mock_html = """
        <html>
            <body>
                <h2>Test Category</h2>
                <li class="lightbox-nutrition">
                    <a data-clean-diet-str="Halal, Vegetarian">Test Item 1</a>
                </li>
                <li class="lightbox-nutrition">
                    <a data-clean-diet-str="Plant Based">Test Item 2</a>
                </li>
                <h2>Another Category</h2>
                <li class="lightbox-nutrition">
                    <a data-clean-diet-str="">Test Item 3</a>
                </li>
            </body>
        </html>
        """
        
        # Create a mock response
        from scrapy.http import HtmlResponse
        url = 'https://umassdining.com/locations-menus/worcester/menu'
        response = HtmlResponse(url=url, body=mock_html, encoding='utf-8')
        
        # Parse the response
        items = list(self.spider.parse(response))
        
        # Assertions
        self.assertEqual(len(items), 3)
        
        # Check first item
        self.assertEqual(items[0]['item_name'], 'Test Item 1')
        self.assertEqual(items[0]['category'], 'Test Category')
        self.assertEqual(items[0]['tags'], ['Halal', 'Vegetarian'])
        self.assertEqual(items[0]['location'], 'Worcester Dining Commons')
        
        # Check second item
        self.assertEqual(items[1]['item_name'], 'Test Item 2')
        self.assertEqual(items[1]['tags'], ['Plant Based'])
        
        # Check third item (different category, no tags)
        self.assertEqual(items[2]['item_name'], 'Test Item 3')
        self.assertEqual(items[2]['category'], 'Another Category')
        self.assertEqual(items[2]['tags'], [])


if __name__ == '__main__':
    unittest.main()