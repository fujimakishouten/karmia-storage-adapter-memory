/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint devel: true, node: true, nomen: true, stupid: true */
'use strict';



/**
 * KarmiaStorageAdapterMemory
 *
 * @class
 */
class KarmiaStorageAdapterMemory {
    /**
     * Constructor
     *
     * @param {Object} options
     * @param {Object} connection
     * @constructs KarmiaStorageAdapterMemory
     */
    constructor(options, connection) {
        const self = this;
        self.buffer = [];
        self.map = {};
        self.index = 0;

        self.config = options || {};
        self.infinite = self.config.infinite || false;
        self.size = self.config.size || 10000;
        if (connection) {
            self.connection = connection;
        }
    }

    /**
     * Get connection
     *
     * @returns {Object}
     */
    getConnection() {
        const self = this;

        return self.connection;
    }

    /**
     * Connect to database
     *
     * @param   {Function} callback
     */
    connect(callback) {
        const self = this;
        self.connection = self.connection || self;

        return (callback) ? callback() : Promise.resolve();
    }

    /**
     * Disconnect from database
     *
     * @param {Function} callback
     */
    disconnect(callback) {
        const self = this;
        self.connection = null;

        return (callback) ? callback() : Promise.resolve();
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
module.exports = function (options, connection) {
    return new KarmiaStorageAdapterMemory(options || {}, connection);
};



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
