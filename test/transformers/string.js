const assert = require('assert');

describe('string', function() {
    let StringTransformer = null;

    const parse = {
        getOption: function() {
            return undefined;
        }
    };

    before(function() {
        StringTransformer = require('src/transformers/string');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const obj = {
                string: StringTransformer,
                transform: instance => {
                    assert(instance instanceof StringTransformer);
                    assert.equal(instance._defaultValue, undefined);
                }
            };

            obj.string();
        })

        it('Should create an instance with new keyword', function() {
            const defaultValue = 'Hello Test';
            const instance = new StringTransformer({
                defaultValue: defaultValue
            });

            assert(instance instanceof StringTransformer);
            assert.equal(instance._defaultValue, defaultValue);
        })
    })

    describe('#parse', function() {
        it('Should ignore strings', function() {
            const instance = new StringTransformer();
            const result = instance.parse('hello world', parse);

            assert.equal(result, 'hello world');
        })

        it('Should return default value when undefined', function() {
            const instance = new StringTransformer({
                defaultValue: 'default test'
            });
            const result = instance.parse(undefined, parse);

            assert.equal(result, 'default test');
        })

        it('Should convert anything else to a string', function() {
            const instance = new StringTransformer();
            const result = instance.parse({}, parse);

            assert.equal(result, '[object Object]');
        })

        it('Should honor allow-default option', function() {
            const instance = new StringTransformer();
            const result = instance.parse(undefined, {
                getOption: function(key) {
                    assert.equal(key, 'allow-default');
                }
            });

            assert.equal(typeof result, 'undefined');
        })
    })

    describe('#reverse', function() {
        it('Should ignore strings', function() {
            const instance = new StringTransformer();
            const result = instance.reverse('hello world', parse);

            assert.equal(result, 'hello world');
        })

        it('Should ignore undefined', function() {
            const instance = new StringTransformer();
            const result = instance.reverse(undefined, parse);

            assert.equal(result, undefined);
        })

        it('Should return default if not set', function() {
            const instance = new StringTransformer({
                reverseDefaultValue: 'test-1'
            });
            const result = instance.reverse(undefined, parse);

            assert.equal(result, 'test-1');
        })

        it('Should cast anything else to a string', function() {
            const instance = new StringTransformer();
            const result = instance.reverse({}, parse);

            assert.equal(result, '[object Object]');
        })

        it('Should honor allow-default option', function() {
            const instance = new StringTransformer();
            const result = instance.reverse(undefined, {
                getOption: function(key) {
                    assert.equal(key, 'allow-default');
                }
            });

            assert.equal(typeof result, 'undefined');
        })
    })

});
