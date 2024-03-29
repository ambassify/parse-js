const assert = require('assert');
const isArray = require('lodash/isArray');

describe('map', function() {
    let Map = null;
    let Parse = null;

    before(function() {
        Map = require('src/transformers/map');
        Parse = require('src/index');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const callback = function() {};

            const obj = {
                map: Map,
                transform: instance => {
                    assert(instance instanceof Map);
                    assert.equal(instance._callback, callback);
                }
            };

            obj.map(callback);
        })
    })

    describe('#_createParse', function() {
        it('Should populate the cache correctly', function() {
            const callback = function(p) {
                assert(p instanceof Parse);
                return {
                    parse: () => 'testabcd'
                };
            }
            const instance = new Map(callback);
            instance.parse({ test1: 'test', test2: 'abcd' });

            assert(instance._cache.test1);
            assert(instance._cache.test2);

            const key1 = instance._cache.test1;
            const key2 = instance._cache.test2;
            instance.parse({ test1: 'test', test2: 'abcd' });

            assert(key1 === instance._cache.test1);
            assert(key2 === instance._cache.test2);
        })
    })

    describe('#parse', function() {
        it('Should parse an object correctly', function() {
            const callback = function(p) {
                assert(p instanceof Parse);
                return {
                    parse: () => 'testabcd'
                };
            }
            const instance = new Map(callback);
            const result = instance.parse({ test1: 'test', test2: 'abcd' });

            assert.deepEqual(result, {
                test1: 'testabcd',
                test2: 'testabcd'
            });
        })

        it('Should parse an array correctly', function() {
            const callback = function(p) {
                assert(p instanceof Parse);
                return {
                    parse: (v) => '_' + v
                };
            }
            const instance = new Map(callback);
            const result = instance.parse([ 'test', 'abcd' ]);

            assert.deepEqual(result, [
                '_test',
                '_abcd'
            ]);
        })

        it('Should detect object or array', function() {
            const callback = function(p) {
                assert(p instanceof Parse);
                return {
                    parse: () => 'testabcd'
                };
            }
            const instance = new Map(callback);
            const result = instance.parse([ 'test', 'abcde' ]);

            assert.ok(isArray(result));
            assert.deepEqual(result, [
                'testabcd',
                'testabcd'
            ]);
        })
    })

    describe('#reverse', function() {
        it('Should reverse an object correctly', function() {
            const callback = function(p) {
                assert(p instanceof Parse);
                return {
                    reverse: () => 'abcd'
                };
            }
            const instance = new Map(callback);
            const result = instance.reverse({ test1: 'test', test2: 'abcd' });

            assert.deepEqual(result, { test1: 'abcd', test2: 'abcd' });
        })

        it('Should reverse an object with dots in keys correctly', function() {
            const callback = function(p) {
                assert(p instanceof Parse);

                return {
                    reverse: (v) => '_' + v
                };
            }

            const instance = new Map(callback);

            const result = instance.reverse({
                test1: 'test',
                'test1.subTest': 'subTest'
            });

            assert.deepEqual(result, {
                test1: '_test',
                'test1.subTest': '_subTest'
            });
        })

        it('Should detect object or array', function() {
            const callback = function(p) {
                assert(p instanceof Parse);

                return {
                    reverse: (v) => '_' + v
                };
            }
            const instance = new Map(callback);
            const result = instance.reverse([ 'test', 'abcd' ]);

            assert.ok(isArray(result));
            assert.deepEqual(result, [ '_test', '_abcd' ]);
        })
    })
});
