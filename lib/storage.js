/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



/**
 * KarmiaStorageAdapterMemoryStorage
 *
 * @class
 */
class KarmiaStorageAdapterMemoryStorage {
    /**
     * Constructor
     *
     * @param {Object} connection
     * @param {Object} options
     * @constructs KarmiaStorageAdapterMemoryStorage
     */
    constructor(connection, options) {
        const self = this;
        self.buffer = [];
        self.map = {};
        self.index = 0;

        self.connection = connection;
        self.config = options || {};

        self.infinite = self.config.infinite || false;
        self.size = self.config.size || 10000;
    }

    /**
     * Store new data
     *
     * @param {string} key
     * @param {*} value
     * @param {Function} callback
     */
    store(key, value, callback) {
        const self = this;
        if (!self.infinite) {
            self.index = (self.index < self.size) ? self.index : 0;

            // Delete existing data
            const current = self.buffer[self.index];
            if (current) {
                delete self.buffer[current.key];
            }
        }

        // Store data
        self.map[key] = self.index;
        self.buffer[self.index] = {
            key: key,
            value: value
        };

        // Increment counter
        self.index = self.index + 1;

        return (callback) ? callback(null, value) : Promise.resolve(value);
    }

    /**
     * Get buffer length
     *
     * @param {Function} callback
     */
    count(callback) {
        const self = this;

        return (callback) ? callback(null, self.buffer.length) : Promise.resolve(self.buffer.length);
    }

    /**
     * Check is key exists
     *
     * @param {string} key
     * @param {Function} callback
     */
    has(key, callback) {
        const self = this;

        return (callback) ? callback(null, (key in self.map)) : Promise.resolve(key in self.map);
    }

    /**
     * Get data
     *
     * @param {string} key
     * @param {Function} callback
     */
    get(key, callback) {
        const self = this;

        return self.has(key).then(function (exists) {
            const result = (exists) ?  self.buffer[self.map[key]].value : null;

            return (callback) ? callback(null, result) : Promise.resolve(result);
        });
    }

    /**
     * Update existing data
     *
     * @param {string} key
     * @param {*} value
     * @param {Function} callback
     */
    set(key, value, callback) {
        const self = this;

        return self.has(key).then(function (exists) {
            if (exists) {
                self.buffer[self.map[key]].value = value;

                return (callback) ? callback(null, value) : Promise.resolve(value);
            }

            return self.store(key, value, callback);
        });
    }

    /**
     * Remove data
     *
     * @param {string} key
     * @param {Function} callback
     */
    remove(key, callback) {
        const self = this;

        return self.has(key).then(function (exists) {
            if (exists) {
                const index = self.map[key];

                self.buffer.splice(index, 1);
                delete self.map[key];
            }

            return (callback) ? callback() : Promise.resolve();
        });
    }
}


// Export module
module.exports = function (connection, options) {
    return new KarmiaStorageAdapterMemoryStorage(connection, options || {});
};



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */

