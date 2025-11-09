from scrapy import signals

class ScrapyFolderSpiderMiddleware:
    # Not all methods need to be implemented. If a method is not implemented, scrapy acts as if the spider middleware does not exist.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_spider_input(self, response, spider):
        # Called for each response that goes through the spider middleware
        # and into the spider (for processing).

        # Should return None or raise an exception.
        return None

    def process_spider_output(self, response, result, spider):
        # Called with the results returned from the Spider, after
        # it has processed the response.

        # Must return an iterable of Request, or dict or Item objects.
        for i in result:
            yield i

    def process_spider_exception(self, response, exception, spider):
        # Called when a spider or process_spider_input() method
        # (or any other spider middleware method) raises an exception.

        # Should return either None or an iterable of Request or Item objects.
        pass

    def process_start_requests(self, start_requests, spider):
        # Called with the start requests of the spider, and works
        # similarly to the process_spider_output() method, except
        # that it doesn’t have a response associated.

        # Must return only requests (not items).
        for r in start_requests:
            yield r

    def spider_opened(self, spider):
        spider.logger.info('Spider opened: %s' % spider.name)


class ScrapyFolderDownloaderMiddleware:
    # Not all methods need to be implemented. If a method is not implemented, scrapy acts as if the downloader middleware does not exist.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your downloader middlewares.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_request(self, request, spider):
        # Called for each request that goes through the downloader
        # middleware.

        # Must either:
        # - return None: continue processing this request
        # - return a Response object
        # - return a Request object
        # - raise IgnoreRequest: stop processing this request
        return None

    def process_response(self, request, response, spider):
        # Called with the response after it has passed through all downloader
        # middlewares and before the spider is called.

        # Must return either:
        # - a Response object
        # - a Request object
        # - or raise IgnoreRequest
        return response

    def process_exception(self, request, exception, spider):
        # Called when a download handler or a process_request()
        # (or other downloader middleware method) raises an exception.

        # Must either:
        # - return None: continue processing this exception
        # - return a Response object: stops exception processing and returns the response
        # - return a Request object: stops exception processing and re-schedules the request
        pass

    def spider_opened(self, spider):
        spider.logger.info('Spider opened: %s' % spider.name)