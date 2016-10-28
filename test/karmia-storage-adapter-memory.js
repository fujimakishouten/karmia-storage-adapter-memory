/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint node: true, nomen: true */
/*global beforeEach, describe, it */
'use strict';



// Variables
const co = require('co'),
    expect = require('expect.js'),
    adapter = require('../');


describe('karmia-storage-adapter-memory', function () {
    describe('getConnection', function () {
        it('Should not get connection', function (done) {
            const storage = adapter();
            expect(storage.getConnection()).to.be(undefined);

            done();
        });

        it('Should get connection', function (done) {
            const storage = adapter();
            storage.connect().then(function () {
                const connection = storage.getConnection();
                expect(connection.constructor.name).to.be('KarmiaStorageAdapterMemory');

                done();
            });
        });
    });

    describe('connect', function () {
        describe('Should connect to database', function () {
            it('Promise', function (done) {
                const storage = adapter();
                storage.connect().then(function () {
                    const connection = storage.getConnection();
                    expect(connection.constructor.name).to.be('KarmiaStorageAdapterMemory');

                    done();
                }).catch(function (error) {
                    done(error);
                });
            });

            it('Callback', function (done) {
                const storage = adapter();
                storage.connect(function (error) {
                    if (error) {
                        return done(error);
                    }

                    const connection = storage.getConnection();
                    expect(connection.constructor.name).to.be('KarmiaStorageAdapterMemory');

                    done();
                });
            });
        });
    });

    describe('disconnect', function () {
        describe('Should disconnect database', function () {
            describe('Connected', function () {
                it('Promise', function (done) {
                    const storage = adapter();
                    storage.connect().then(function () {
                        return storage.disconnect();
                    }).then(function (result) {
                        expect(result).to.be(undefined);

                        done();
                    }).catch(done);
                });

                it('Callback', function (done) {
                    const storage = adapter();
                    storage.connect().then(function () {
                        storage.disconnect(function (error, result) {
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
                    const storage = adapter();
                    storage.disconnect().then(function (result) {
                        expect(result).to.be(undefined);

                        done();
                    }).catch(done);
                });

                it('Callback', function (done) {
                    const storage = adapter();
                    storage.disconnect(function (error, result) {
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

    describe('store', function () {
        describe('Should store value', function () {
            it('Promise', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        storage = adapter({size: 5});

                    expect(storage.buffer.length).to.be(0);
                    yield storage.store(key, value);
                    expect(storage.buffer.length).to.be(1);
                    expect(storage.buffer[0]).to.eql({
                        key: key,
                        value: value
                    });

                    done();
                });
            });

            it('Callback', function (done) {
                const key = 'KEY',
                    value = 'VALUE',
                    storage = adapter({size: 5});

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

                    done();
                });
            });
        });

        describe('Should overwrite old value', function () {
            it('Promise', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        size = 5,
                        storage = adapter({size: size});

                    expect(storage.buffer.length).to.be(0);
                    for (let i = 0; i < size; ++i) {
                        yield storage.store(i, i);
                    }
                    expect(storage.buffer.length).to.be(size);

                    yield storage.store(key, value);
                    expect(storage.buffer.length).to.be(size);
                    expect(storage.buffer[0]).to.eql({
                        key: key,
                        value: value
                    });

                    done();
                });
            });

            it('Callback', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        size = 5,
                        storage = adapter({size: size});

                    expect(storage.buffer.length).to.be(0);
                    for (let i = 0; i < size; ++i) {
                        yield storage.store(i, i);
                    }
                    expect(storage.buffer.length).to.be(size);

                    storage.store(key, value, function (error) {
                        if (error) {
                            return done(error);
                        }

                        expect(storage.buffer.length).to.be(size);
                        expect(storage.buffer[0]).to.eql({
                            key: key,
                            value: value
                        });

                        done();
                    });
                });
            });
        });

        describe('Should set adapter size to unlimited', function () {
            it('Promise', function (done) {
                co(function* () {
                    const size = 5,
                        infinite = true,
                        storage = adapter({
                            size: size,
                            infinite: infinite
                        });

                    for (let i = 0; i < size + 1; ++i) {
                        yield storage.store(i, i);
                    }

                    expect(storage.buffer.length).to.be(size + 1);

                    done();
                });
            });

            it('Callback', function (done) {
                co(function* () {
                    const size = 5,
                        infinite = true,
                        storage = adapter({
                            size: size,
                            infinite: infinite
                        });

                    for (let i = 0; i < size; ++i) {
                        yield storage.store(i, i);
                    }

                    storage.store('key', 'value', function (error) {
                        if (error) {
                            return done(error);
                        }

                        expect(storage.buffer.length).to.be(size + 1);

                        done();
                    });
                });
            });
        });
    });

    describe('count', function () {
        describe('Should count items', function () {
            it('Promise', function (done) {
                co(function* () {
                    const size = 5,
                        length = 3,
                        storage = adapter({size: size});

                    expect(yield storage.count()).to.be(0);
                    for (let i = 0; i < length; ++i) {
                        yield storage.store(i, i);
                    }
                    expect(yield storage.count()).to.be(length);

                    done();
                });
            });

            it('Callback', function (done) {
                co(function* () {
                    const size = 5,
                        length = 3,
                        storage = adapter({size: size});

                    expect(yield storage.count()).to.be(0);
                    for (let i = 0; i < length; ++i) {
                        yield storage.store(i, i);
                    }

                    storage.count(function (error, result) {
                        if (error) {
                            return done(error);
                        }

                        expect(result).to.be(length);

                        done();
                    });
                });
            });
        });
    });

    describe('has', function () {
        describe('Should check is key exists', function () {
            it('Promise', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        storage = adapter({size: 5});

                    expect(yield storage.has(key)).to.be(false);
                    yield storage.store(key, value);
                    expect(yield storage.has(key)).to.be(true);

                    done();
                });
            });

            it('Callback', function (done) {
                const key = 'KEY',
                    value = 'VALUE',
                    storage = adapter({size: 5});

                storage.has(key, function (error, result) {
                    if (error) {
                        return done(error);
                    }

                    expect(result).to.be(false);
                    storage.store(key, value, function (error) {
                        if (error) {
                            return done(error);
                        }

                        storage.has(key, function (error, result) {
                            if (error) {
                                return done(error);
                            }

                            expect(result).to.be(true);

                            done();
                        });
                    });
                });
            });
        });



    });

    describe('set', function () {
        describe('Should store new value', function () {
            it('Promise', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        storage = adapter({size: 5});

                    expect(storage.buffer.length).to.be(0);
                    yield storage.set(key, value);
                    expect(storage.buffer.length).to.be(1);
                    expect(storage.buffer[0]).to.eql({
                        key: key,
                        value: value
                    });

                    done();
                });
            });

            it('Callback', function (done) {
                const key = 'KEY',
                    value = 'VALUE',
                    storage = adapter({size: 5});

                expect(storage.buffer.length).to.be(0);
                storage.set(key, value, function (error) {
                    if (error) {
                        return done(error);
                    }

                    expect(storage.buffer.length).to.be(1);
                    expect(storage.buffer[0]).to.eql({
                        key: key,
                        value: value
                    });

                    done();
                });
            });
        });

        describe('Should update value', function () {
            it('Promise', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        update = 'VALUE_UPDATED',
                        storage = adapter({size: 5});

                    yield storage.store(key, value);
                    expect(storage.buffer[0]).to.eql({
                        key: key,
                        value: value
                    });

                    yield storage.set(key, update);
                    expect(storage.buffer[0]).to.eql({
                        key: key,
                        value: update
                    });

                    done();
                });
            });

            it('Callback', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        update = 'VALUE_UPDATED',
                        storage = adapter({size: 5});

                    storage.store(key, value, function (error) {
                        if (error) {
                            return done(error);
                        }

                        expect(storage.buffer[0]).to.eql({
                            key: key,
                            value: value
                        });

                        storage.set(key, update, function (error) {
                            if (error) {
                                return done(error);
                            }

                            expect(storage.buffer[0]).to.eql({
                                key: key,
                                value: update
                            });

                            done();
                        });
                    });
                });
            });
        });
    });

    describe('get', function () {
        describe('Should get value', function () {
            it('Promise', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        storage = adapter({size: 5});

                    yield storage.store(key, value);
                    expect(yield storage.get(key)).to.be(value);

                    done();
                });
            });

            it('Callback', function (done) {
                const key = 'KEY',
                    value = 'VALUE',
                    storage = adapter({size: 5});

                storage.store(key, value, function (error) {
                    if (error) {
                        return done(error);
                    }

                    storage.get(key, function (error, result) {
                        if (error) {
                            return done(error);
                        }

                        expect(result).to.be(value);

                        done();
                    });
                });
            });
        });

        describe('Should get updated value', function () {
            it('Promise', function (done) {
                co(function* () {
                    const key = 'KEY',
                        value = 'VALUE',
                        update = 'VALUE_UPDATED',
                        storage = adapter({size: 5});

                    yield storage.store(key, value);
                    expect(yield storage.get(key)).to.be(value);
                    yield storage.store(key, update);
                    expect(yield storage.get(key)).to.be(update);

                    done();
                });
            });

            it('Callback', function (done) {
                const key = 'KEY',
                    value = 'VALUE',
                    update = 'VALUE_UPDATED',
                    storage = adapter({size: 5});

                storage.store(key, value, function (error, result) {
                    if (error) {
                        return done(error);
                    }

                    storage.get(key, function (error, result) {
                        if (error) {
                            return done(error);
                        }

                        expect(result).to.be(value);
                        storage.set(key, update, function (error) {
                            if (error) {
                                return done(error);
                            }

                            storage.get(key, function (error, result) {
                                if (error) {
                                    return done(error);
                                }

                                expect(result).to.be(update);

                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    describe('remove', function () {
        describe('Should remove value', function () {
            it('Promise', function (done) {
                co(function* () {
                    const size = 5,
                        storage = adapter({size: size});

                    for (let i = 0; i < size; ++i) {
                        yield storage.store(i, i);
                    }

                    expect(storage.buffer.length).to.be(size);
                    yield storage.remove(2);
                    expect(storage.buffer.length).to.be(size - 1);
                    expect(storage.map[2]).to.be(undefined);

                    done();
                });
            });

            it('Callback', function (done) {
                co(function* () {
                    const size = 5,
                        storage = adapter({size: size});

                    for (let i = 0; i < size; ++i) {
                        yield storage.store(i, i);
                    }

                    expect(storage.buffer.length).to.be(size);
                    storage.remove(2, function (error, result) {
                        expect(storage.buffer.length).to.be(size - 1);
                        expect(storage.map[2]).to.be(undefined);

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

