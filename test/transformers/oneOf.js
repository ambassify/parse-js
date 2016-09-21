const assert = require('assert');

describe('oneOf', function() {
    let OneOfTransformer = null;

    before(function() {
        OneOfTransformer = require('src/transformers/oneOf');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const parsers = [];
            const obj = {
                oneOf: OneOfTransformer,
                transform: instance => {
                    assert(instance instanceof OneOfTransformer);
                    assert.equal(instance._parsers, parsers);
                    assert.equal(typeof instance._test, 'function');
                    assert.equal(instance._reverseAll, true);
                }
            };

            obj.oneOf(parsers);
        })

        it('Should create an instance with new keyword', function() {
            const parsers = [];
            const test = function() {};
            const instance = new OneOfTransformer(parsers, {
                test: test,
                reverseAll: false
            });

            assert(instance instanceof OneOfTransformer);
            assert.equal(instance._parsers, parsers);
            assert.equal(instance._test, test);
            assert.equal(instance._reverseAll, false);
        })
    })

    describe('#parse', function() {
        it('Should return the first parser with a result', function() {
            const parsers = [
                { parse: function() {} },
                { parse: function() { return 'test'; } },
                { parse: function() { return 'test1'; } }
            ]
            const instance = new OneOfTransformer(parsers);

            assert.equal(instance.parse(), 'test');
        })

        it('Should consider false as a result', function() {
            const parsers = [
                { parse: function() {} },
                { parse: function() { return false; } },
                { parse: function() { return 'test1'; } }
            ]
            const instance = new OneOfTransformer(parsers);

            assert.equal(instance.parse(), false);
        })

        it('Should consider 0 as a result', function() {
            const parsers = [
                { parse: function() {} },
                { parse: function() { return 0; } },
                { parse: function() { return 'test1'; } }
            ]
            const instance = new OneOfTransformer(parsers);

            assert.equal(instance.parse(), 0);
        })

        it('Should return undefined if none is found', function() {
            const parsers = [
                { parse: function() {} },
                { parse: function() {} }
            ]
            const instance = new OneOfTransformer(parsers);

            assert.equal(typeof instance.parse(), 'undefined');
        })
    })

    describe('#reverse', function() {
        it('Should reverse a value correctly', function() {
            const parsers = [
                { reverse: function() { return { test: 'a' }; } },
                { reverse: function() { return { test1: 'b' }; } }
            ];
            const instance = new OneOfTransformer(parsers);

            assert.deepEqual(instance.reverse(), {
                test: 'a',
                test1: 'b'
            });
        })

        it('Should throw error when there are no parsers', function() {
            assert.throws(function() {
                const instance = new OneOfTransformer([]);
                instance.reverse();
            })
        })

        it('Should ignore reversers that return undefined', function() {
            const instance = new OneOfTransformer([{
                reverse: function() {}
            }]);
            assert.deepEqual(instance.reverse(), {});
        })

        it('Should only return the first reverser', function() {
            const obj = { 'a': 'test' };
            const instance = new OneOfTransformer([{
                reverse: function() { return obj; }
            }], { reverseAll: false });
            assert.equal(instance.reverse(), obj);
        })

        it('Should only use merge strategy for objects', function() {
            const instance = new OneOfTransformer([
                { reverse: function() { return 123; } },
                { reverse: function() { return {}; } },
                { reverse: function() { return { 'a': 'test' }; } },
                { reverse: function() { return 456; } }
            ]);
            assert.equal(instance.reverse(), 456);
        })
    })

});
