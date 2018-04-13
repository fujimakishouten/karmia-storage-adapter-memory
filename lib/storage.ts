/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



// Declaration
declare interface Connection {
    [index: string]: any;
}

declare interface Options {
    infinite?: boolean;
    size?: number;
}

declare interface Item {
    key: any;
    value: any;
}


/**
 * KarmiaStorageAdapterMemoryStorage
 *
 * @class
 */
class KarmiaStorageAdapterMemoryStorage {
    /**
     * Properties
     */
    public buffer: Array<Item>;
    public map: {[index: string]: number};
    public index: number;

    public connection: Connection;
    public config: Options;
    public infinite: boolean;
    public size: number;

    /**
     * Constructor
     *
     * @param {Object} [connection]
     * @param {Object} [options]
     * @constructs KarmiaStorageAdapterMemoryStorage
     */
    constructor(connection?: Connection, options?: Options) {
        const self = this;
        self.buffer = [];
        self.map = {};
        self.index = 0;

        self.connection = connection || {};
        self.config = options || {};

        self.infinite = self.config.infinite || false;
        self.size = self.config.size || 10000;
    }

    /**
     * Store new data
     *
     * @param {string} key
     * @param {*} value
     * @param {Function} [callback]
     */
    store(key: any, value: any, callback?: (error?: Error, result?: any) => void): Promise<any> {
        const self = this;
        if (!self.infinite) {
            self.index = (self.index < self.size) ? self.index : 0;
        }

        // Store data
        self.map[key] = self.index;
        self.buffer[self.index] = {
            key: key,
            value: value
        } as Item;

        // Increment counter
        self.index = self.index + 1;

        if (!callback) {
            return Promise.resolve(value);
        }

        callback(null, value);
    }

    /**
     * Get buffer length
     *
     * @param {Function} [callback]
     */
    count(callback?: (error?: Error, result?: any) => void): Promise<any> {
        const self = this;

        if (!callback) {
            return Promise.resolve(self.buffer.length);
        }

        callback(null, self.buffer.length);
    }

    /**
     * Check is key exists
     *
     * @param {string} key
     * @param {Function} [callback]
     */
    has(key: any, callback?: (error?: Error, result?: any) => void): Promise<any> {
        const self = this;

        if (!callback) {
            return Promise.resolve(key in self.map);
        }

        callback(null, (key in self.map));
    }

    /**
     * Get data
     *
     * @param {string} key
     * @param {Function} [callback]
     */
    get(key: any, callback?: (error?: Error, result?: any) => void): Promise<any> {
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
     * @param {Function} [callback]
     */
    set(key: any, value: any, callback?: (error?: Error, result?: any) => void): Promise<any> {
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
     * @param {Function} [callback]
     */
    remove(key: any, callback?: (error?: Error, result?: any) => void): Promise<any> {
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
export = KarmiaStorageAdapterMemoryStorage;



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
