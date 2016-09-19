const assert = require('assert');

describe('json', function() {
    let JSONTransformer = null;

    before(function() {
        JSONTransformer = require('src/transformers/json');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const obj = {
                json: JSONTransformer,
                transform: instance => {
                    assert(instance instanceof JSONTransformer);
                    assert.equal(instance._defaultValue, undefined);
                }
            };

            obj.json();
        })

        it('Should create an instance with new keyword', function() {
            const defaultValue = {};
            const instance = new JSONTransformer({
                defaultValue: defaultValue
            });

            assert(instance instanceof JSONTransformer);
            assert.equal(instance._defaultValue, defaultValue);
        })
    })

    describe('#parse', function() {
        it('Should parse JSON', function() {
            const instance = new JSONTransformer();
            const result = instance.parse('{"hello":"world"}');

            assert.deepEqual(result, {hello: 'world'});
        })

        it('Should return defaultValue when set', function() {
            const instance = new JSONTransformer({
                defaultValue: {'default': 'object'}
            });
            const result = instance.parse('}{');

            assert.deepEqual(result, {default: 'object'});
        })

        it('Should return null when invalid without default', function() {
            const instance = new JSONTransformer();
            const result = instance.parse('}{');

            assert.deepEqual(result, null);
        })

        it('Should ignore non-string values', function() {
            const test = { hello: 'world' };
            const instance = new JSONTransformer();
            const result = instance.parse(test);

            assert.equal(result, test);
        })
    })

    describe('#reverse', function() {
        it('Should convert to JSON', function() {
            const test = { hello: 'world' };
            const instance = new JSONTransformer();
            const result = instance.reverse(test);

            assert.equal(result, '{"hello":"world"}');
        })
    })
});
