#!/usr/bin/env python3
""" Basic dictionary """

from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """ Basic caching system """

    def put(self, key, item):
        """ Puts an item in the cache """
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """ Gets an item from the cache """
        return self.cache_data.get(key, None)
