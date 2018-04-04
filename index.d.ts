declare interface KarmiaStorageAdapterStorageInterface {
    store(key: any, value: any, callback?: (error: Error, result: any) => void): Promise<any>;
    count(callback?: (error: Error, result: any) => void): Promise<any>;
    has(key: any, callback?: (error: Error, result: any) => void): Promise<any>;
    get(key: any, callback?: (error: Error, result: any) => void): Promise<any>;
    set(key: any, value: any, callback?: (error: Error, result: any) => void): Promise<any>;
    remove(key: any, callback?: (error: Error, result: any) => void): Promise<any>;
}

declare class KarmiaStorageAdapterMemoryStorage implements KarmiaStorageAdapterStorageInterface {
    buffer: Array<any>;
    map: object;
    index: number;
    connection: object;
    config: object;
    infinite: boolean;
    size: number;

    constructor(options?: object, connection?: object);
    store(key: any, value: any, callback?: (error: Error, result: any) => void): Promise<any>;
    count(callback?: (error: Error, result: any) => void): Promise<any>;
    has(key: any, callback?: (error: Error, result: any) => void): Promise<any>;
    get(key: any, callback?: (error: Error, result: any) => void): Promise<any>;
    set(key: any, value: any, callback?: (error: Error, result: any) => void): Promise<any>;
    remove(key: any, callback?: (error: Error, result: any) => void): Promise<any>;
}

declare interface KarmiaStorageAdapterInterface {
    getConnection():object;
    connect(callback?: (error: Error, result: any) => void): Promise<any>;
    disconnect(callback?: (error: Error, result: any) => void): Promise<any>;
    storage(name: string, options?: object): KarmiaStorageAdapterMemoryStorage;
}

declare class KarmiaStorageAdapterMemory implements KarmiaStorageAdapterInterface {
    config: object;
    infinite: boolean;
    size: number;
    connection?: object|null|undefined;

    constructor(options?: object, connection?: object);
    getConnection(): object;
    connect(callback?: (error: Error, result: any) => void): Promise<any>;
    disconnect(callback?: (error: Error, result: any) => void): Promise<any>;
    storage(name: string, options?: object): KarmiaStorageAdapterMemoryStorage;
}

export = KarmiaStorageAdapterMemory;
