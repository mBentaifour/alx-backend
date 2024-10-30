#!/usr/bin/env python3
"""LIFO > Last-In First-Out caching
"""
from collections import OrderedDict

from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """Create a class LIFOCache
    that inherits from BaseCaching
    and is a caching system
    """
    def __init__(self):
        """Initialize the cache
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """Add an item in the cache
        """
        if key is None or item is None:
            return
        if key not in self.cache_data:
            if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                last_key, _ = self.cache_data.popitem(True)
                print("DISCARD:", last_key)
        self.cache_data[key] = item
        self.cache_data.move_to_end(key, last=True)

    def get(self, key):
        """Retrieve an item by key
        """
        return self.cache_data.get(key, None)
