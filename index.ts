/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint devel: true, node: true, nomen: true, stupid: true */
'use strict';



// Import modules
import Storage = require("./lib/storage");


// Declarations
declare interface Connection {
    [index: string]: any;
}

declare interface Options {
    infinite?: boolean;
    size?: number;
}


/**
 * KarmiaStorageAdapterMemory
 *
 * @class
 */
class KarmiaStorageAdapterMemory {
    /**
     * Properties
     */
    public config: Options;
    public infinite: boolean;
    public size: number;
    public connection?: Connection;
    public storages: {[index: string]: Storage};

    /**
     * Constructor
     *
     * @param {Object} [options]
     * @param {Object} [connection]
     * @constructs KarmiaDatabaseAdapterMemory
     */
    constructor(options?: Options, connection?: Connection) {
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
    getConnection(): Connection {
        const self = this;

        return self.connection;
    }

    /**
     * Connect to database
     *
     * @param   {Function} [callback]
     */
    connect(callback?: (error?: Error, result?: any) => void): Promise<any> {
        const self = this;
        self.connection = self.connection || self;

        if (!callback) {
            return Promise.resolve();
        }

        callback();
    }

    /**
     * Disconnect from database
     *
     * @param {Function} [callback]
     */
    disconnect(callback?: (error?: Error, result?: any) => void): Promise<any> {
        const self = this;
        self.connection = null;

        if (!callback) {
            return Promise.resolve();
        }

        callback();
    }

    /**
     * Get table
     *
     * @param   {string} name
     * @param   {Object} [options]
     * @returns {Object}
     */
    storage(name: string, options?: Options) {
        const self = this;
        self.storages = self.storages || {};
        if (self.storages[name]) {
            return self.storages[name];
        }

        const parameters = {
            infinite: self.infinite,
            size: self.size
        };
        self.storages[name] = new Storage(self.connection, Object.assign(parameters, options || {}));

        return self.storages[name];
    }
}


// Export module
export = KarmiaStorageAdapterMemory;



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
