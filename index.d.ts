declare class KarmiaStorageAdapterMemoryStorage {
    buffer: Array<any>;
    map: object;
    index: number;
    connection: object;
    config: object;
    infinite: boolean;
    size: number;

    store(key: any, value: any, callback?: (error: Error, result?: any) => void): Promise<any>|void;
    count(callback?: (error: Error, result?: any) => void): Promise<any>|void;
    has(key: any, callback?: (error: Error, result?: any) => void): Promise<any>|void;
    get(key: any, callback?: (error: Error, result?: any) => void): Promise<any>|void;
    key(key: any, value: any, callback?: (error: Error, result?: any) => void): Promise<any>|void;
    remove(key: any, callback?: (error: Error, result?: any) => void): Promise<any>|void;
}

declare class KarmiaStorageAdapterMemory {
    config: object;
    infinite: boolean;
    size: number;
    connection?: object;

    constructor(options: object, connection?: object);
    getConnection(): object|undefined;
    connect(callback?: (error: Error, result?: any) => void): Promise<void>|undefined;
    disconnect(callback?: (error: Error, result?: any) => void): Promise<void>|undefined;
    getStorage(name: string, options?: object): KarmiaStorageAdapterMemoryStorage;
}

export = KarmiaStorageAdapterMemory;
