const assert = require('assert');

describe('json', function() {
    let JSONTransformer = null;

    const parse = {
        getOption: function() {
            return undefined;
        }
    };

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
            const result = instance.parse('{"hello":"world"}', parse);

            assert.deepEqual(result, {hello: 'world'});
        })

        it('Should return defaultValue when set', function() {
            const instance = new JSONTransformer({
                defaultValue: {'default': 'object'}
            });
            const result = instance.parse('}{', parse);

            assert.deepEqual(result, {default: 'object'});
        })

        it('Should return null when invalid without default', function() {
            const instance = new JSONTransformer();
            const result = instance.parse('}{', parse);

            assert.deepEqual(result, null);
        })

        it('Should ignore non-string values', function() {
            const test = { hello: 'world' };
            const instance = new JSONTransformer();
            const result = instance.parse(test, parse);

            assert.equal(result, test);
        })

        it('Should honor allow-default option', function() {
            const instance = new JSONTransformer();
            const result = instance.parse(undefined, {
                getOption: function(key) {
                    assert.equal(key, 'allow-default');
                }
            });

            assert.equal(typeof result, 'undefined');
        })
    })

    describe('#reverse', function() {
        it('Should convert to JSON', function() {
            const test = { hello: 'world' };
            const instance = new JSONTransformer();
            const result = instance.reverse(test, parse);

            assert.equal(result, '{"hello":"world"}');
        })

        it('Should honor allow-default option', function() {
            const instance = new JSONTransformer();
            const result = instance.reverse(undefined, {
                getOption: function(key) {
                    assert.equal(key, 'allow-default');
                }
            });

            assert.equal(typeof result, 'undefined');
        })
    })
});
