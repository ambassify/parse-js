const assert = require('assert');

describe('map', function() {
    let Map = null;
    let Parse = null;

    before(function() {
        Map = require('src/transformers/map');
        Parse = require('src/parse');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const obj = {
                map: Map,
                transform: instance => {
                    assert(instance instanceof Map);
                    assert.equal(instance._callback, callback);
                }
            };

            const callback = function() {};
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
    })

    describe('#reverse', function() {
        it('Should reverse an object correctly', function() {
            const callback = function(p) {
                assert(p instanceof Parse);
                return {
                    reverse: (v) => ({ test1: v })
                };
            }
            const instance = new Map(callback);
            const result = instance.reverse({ test1: 'test', test2: 'abcd' });

            assert.deepEqual(result, { test1: 'abcd' });
        })
    })
});
