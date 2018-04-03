/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint devel: true, node: true, nomen: true, stupid: true */
'use strict';



// Variables
const storage = require('./storage');


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
     * @constructs KarmiaDatabaseAdapterMemory
     */
    constructor(options, connection) {
        const self = this;
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
     * Get table
     *
     * @param   {string} name
     * @param   {Object} options
     * @returns {Object}
     */
    storage(name, options) {
        const self = this;
        self.storages = self.storages || {};
        if (self.storages[name]) {
            return self.storages[name];
        }

        const parameters = {
            infinite: self.infinite,
            size: self.size
        };
        self.storages[name] = new storage(self.connection, Object.assign(parameters, options || {}));

        return self.storages[name];
    }
}


// Export module
module.exports = KarmiaStorageAdapterMemory;



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
