#!/usr/bin/env python3

"""Basic dictionary"""
"""a class BasicCache that inherits"""

from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """basic caching system"""

    def put(self, key, item):
        """puts an item in the cache"""
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """gets an item from the cache"""
        return self.cache_data.get(key, None)
