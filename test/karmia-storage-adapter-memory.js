/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint node: true, nomen: true */
/*global beforeEach, describe, it */
'use strict';



// Variables
const expect = require('expect.js'),
    fixture = require('./resource/fixture'),
    adapter = require('../'),
    options = {};


describe('karmia-storage-adapter-memory', function () {
    describe('getConnection', function () {
        it('Should not get connection', function (done) {
            const storages = new adapter(options);
            expect(storages.getConnection()).to.be(undefined);

            done();
        });

        it('Should get connection', function (done) {
            const storages = new adapter(options);
            storages.connect().then(function () {
                const connection = storages.getConnection();
                expect(connection.constructor.name).to.be('KarmiaStorageAdapterMemory');

                done();
            });
        });

        it('Should get existing connection', function (done) {
            const connection = {name: 'TEST_CONNECTION'},
                storages = new adapter(options, connection);

            expect(storages.getConnection()).to.be(connection);

            done();
        });
    });

    describe('connect', function () {
        describe('Should connect to database', function () {
            it('Promise', function (done) {
                const storages = new adapter(options);
                storages.connect().then(function () {
                    const connection = storages.getConnection();
                    expect(connection.constructor.name).to.be('KarmiaStorageAdapterMemory');

                    done();
                }).catch(function (error) {
                    done(error);
                });
            });

            it('Callback', function (done) {
                const storages = new adapter(options);
                storages.connect(function () {
                    const connection = storages.getConnection();
                    expect(connection.constructor.name).to.be('KarmiaStorageAdapterMemory');

                    done();
                });
            });
        });
    });

    describe('disconnect', function () {
        describe('Should disconnect from database', function () {
            describe('Connected', function () {
                it('Promise', function (done) {
                    const storages = new adapter(options);
                    storages.connect().then(function () {
                        return storages.disconnect();
                    }).then(function (result) {
                        expect(result).to.be(undefined);

                        done();
                    }).catch(done);
                });

                it('Callback', function (done) {
                    const storages = new adapter(options);
                    storages.connect().then(function () {
                        storages.disconnect(function (error, result) {
                            if (error) {
                                return done(error);
                            }

                            expect(result).to.be(undefined);

                            done();
                        });
                    });
                });
            });

            describe('Not connected', function () {
                it('Promise', function (done) {
                    const storages = new adapter(options);
                    storages.disconnect().then(function (result) {
                        expect(result).to.be(undefined);

                        done();
                    }).catch(done);
                });

                it('Callback', function (done) {
                    const storages = new adapter(options);
                    storages.disconnect(function (error, result) {
                        if (error) {
                            return done(error);
                        }

                        expect(result).to.be(undefined);

                        done();
                    });
                });
            });
        });
    });

    describe('storage', function () {
        const storages = new adapter(options),
            name = 'user';

        before(function (done) {
            storages.connect().then(function () {
                const storage = storages.storage(name);

                return fixture.reduce(function (promise, data) {
                    return promise.then(function () {
                        return storage.set(data.key, data.value);
                    });
                }, Promise.resolve());
            }).then(function () {
                done();
            }).catch(done);
        });

        after(function (done) {
            storages.storages = {};

            done();
        });

        describe('count', function () {
            describe('Should count items', function () {
                it('Promise', function (done) {
                    const storage = storages.storage(name);
                    storage.count().then(function (result) {
                        expect(result).to.be(9);

                        done();
                    }).catch(done);
                });

                it('Callback', function (done) {
                    const storage = storages.storage(name);
                    storage.count(function (error, result) {
                        if (error) {
                            return done(error);
                        }

                        expect(result).to.be(9);

                        done();
                    });
                });
            });
        });

        describe('get', function () {
            it('Promise', function (done) {
                const storage = storages.storage(name),
                    data = fixture[0];
                storage.get(data.key).then(function (result) {
                    expect(result).to.be(data.value);

                    done();
                }).catch(done);
            });

            it('Callback', function (done) {
                const storage = storages.storage(name),
                    data = fixture[0];
                storage.get(data.key, function (error, result) {
                    if (error) {
                        return done(error);
                    }

                    expect(result).to.be(data.value);

                    done();
                });
            });
        });

        describe('set', function () {
            it('Promise', function (done) {
                const storage = storages.storage(name),
                    key = 10,
                    value = 'Yukiho Kosaka';

                storage.get(key).then(function (result) {
                    expect(result).to.be(null);

                    return storage.set(key, value);
                }).then(function () {
                    return storage.get(key);
                }).then(function (result) {
                    expect(result).to.be(value);

                    return storage.remove(key);
                }).then(function () {
                    done();
                }).catch(done);
            });

            it('Callback', function (done) {
                const storage = storages.storage(name),
                    key = 10,
                    value = 'Yukiho Kosaka';

                storage.get(key, function (error, result) {
                    if (error) {
                        return done(error);
                    }

                    expect(result).to.be(null);

                    storage.set(key, value, function (error) {
                        if (error) {
                            return done(error);
                        }

                        storage.get(key, function (error, result) {
                            if (error) {
                                return done(error);
                            }

                            expect(result).to.be(value);

                            storage.remove(key, done);
                        })
                    });
                });
            });
        });

        describe('remove', function () {
            it('Promise', function (done) {
                const storage = storages.storage(name),
                    key = 10,
                    value = 'Yukiho Kosaka';

                storage.set(key, value).then(function () {
                    return storage.get(key);
                }).then(function (result) {
                    expect(result).to.be(value);

                    return storage.remove(key);
                }).then(function (result) {
                    expect(result).to.be(undefined);

                    return storage.get(key);
                }).then(function (result) {
                    expect(result).to.be(null);

                    done();
                })
            });

            it('Callback', function (done) {
                const storage = storages.storage(name),
                    key = 10,
                    value = 'Yukiho Kosaka';

                storage.set(key, value, function (error) {
                    if (error) {
                        return done(error);
                    }

                    storage.get(key, function (error, result) {
                        if (error) {
                            return done(error);
                        }

                        expect(result).to.be(value);

                        storage.remove(key, function (error, result) {
                            if (error) {
                                return done(error);
                            }

                            expect(result).to.be(result);

                            storage.get(key, function (error, result) {
                                if (error) {
                                    return done(error);
                                }

                                expect(result).to.be(null);

                                done();
                            });
                        });
                    });
                });
            });
        });

        describe('store', function () {
            describe('Should store value', function () {
                it('Promise', function (done) {
                    const storage = storages.storage('store', {size: 5}),
                        key = 'KEY',
                        value = 'VALUE';

                    expect(storage.buffer.length).to.be(0);
                    storage.store(key, value).then(function () {
                        expect(storage.buffer.length).to.be(1);
                        expect(storage.buffer[0]).to.eql({
                            key: key,
                            value: value
                        });

                        storages.storages = {};

                        done();
                    });
                });

                it('Callback', function (done) {
                    const storage = storages.storage('store', {size: 5}),
                        key = 'KEY',
                        value = 'VALUE';

                    expect(storage.buffer.length).to.be(0);
                    storage.store(key, value, function (error) {
                        if (error) {
                            return done(error);
                        }

                        expect(storage.buffer.length).to.be(1);
                        expect(storage.buffer[0]).to.eql({
                            key: key,
                            value: value
                        });

                        storages.storages = {};

                        done();
                    });
                });
            });

            describe('Should overwrite old value', function () {
                it('Promise', function (done) {
                    const key = 'KEY',
                        value = 'VALUE',
                        size = 5,
                        storage = storages.storage('store', {size: size});

                    expect(storage.buffer.length).to.be(0);
                    Array.apply(null, {length: size}).map(Number.call, Number).reduce(function (collection, value) {
                        return storage.set(value, value);
                    }, Promise.resolve()).then(function () {
                        expect(storage.buffer.length).to.be(size);

                        return storage.set(key, value);
                    }).then(function () {
                        expect(storage.buffer.length).to.be(size);
                        expect(storage.buffer[0]).to.eql({
                            key: key,
                            value: value
                        });

                        storages.storages = {};

                        done();
                    });
                });

                it('Callback', function (done) {
                    const key = 'KEY',
                        value = 'VALUE',
                        size = 5,
                        storage = storages.storage('store', {size: size});

                    expect(storage.buffer.length).to.be(0);
                    Array.apply(null, {length: size}).map(Number.call, Number).reduce(function (collection, value) {
                        return storage.set(value, value);
                    }, Promise.resolve()).then(function () {
                        expect(storage.buffer.length).to.be(size);

                        storage.set(key, value, function (error) {
                            if (error) {
                                return done(error);
                            }

                            expect(storage.buffer.length).to.be(size);
                            expect(storage.buffer[0]).to.eql({
                                key: key,
                                value: value
                            });

                            storages.storages = {};

                            done();
                        });
                    });
                });
            });
        });

        describe('Should set adapter size to unlimited', function () {
            it('Promise', function (done) {
                const size = 5,
                    infinite = true,
                    storage = storages.storage('store', {
                        size: size,
                        infinite: infinite
                    });
                Array.apply(null, {length: size + 1}).map(Number.call, Number).reduce(function (collection, value) {
                    return storage.set(value, value);
                }, Promise.resolve()).then(function () {
                    expect(storage.buffer.length).to.be(size + 1);

                    storages.storages = {};

                    done();
                });
            });

            it('Callback', function (done) {
                const key = 'KEY',
                    value = 'VALUE',
                    size = 5,
                    infinite = true,
                    storage = storages.storage('store', {
                        size: size,
                        infinite: infinite
                    });
                Array.apply(null, {length: size}).map(Number.call, Number).reduce(function (collection, value) {
                    return storage.set(value, value);
                }, Promise.resolve()).then(function () {
                    storage.store(key, value, function (error) {
                        if (error) {
                            return done(error);
                        }

                        expect(storage.buffer.length).to.be(size + 1);

                        storages.storages = {};

                        done();
                    });
                });
            });
        });
    });
});



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */

