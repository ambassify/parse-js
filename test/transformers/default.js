const assert = require('assert');

describe('default', function() {
    let DefaultTransformer = null;

    const parse = {
        getOption: function() {
            return undefined;
        }
    };

    before(function() {
        DefaultTransformer = require('src/transformers/default');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const obj = {
                default: DefaultTransformer,
                transform: instance => {
                    assert(instance instanceof DefaultTransformer);
                    assert.equal(instance._defaultValue, 'parse-default');
                    assert.equal(instance._reverseDefaultValue, 'reverse-default');
                }
            };

            obj.default('parse-default', 'reverse-default');
        })

        it('Should create an instance with new keyword', function() {
            const instance = new DefaultTransformer('parse-default', 'reverse-default');

            assert(instance instanceof DefaultTransformer);
            assert.equal(instance._defaultValue, 'parse-default');
            assert.equal(instance._reverseDefaultValue, 'reverse-default');
        })
    })

    describe('#parse', function() {
        it('Should set default when undefined', function() {
            const instance = new DefaultTransformer('parse-default', 'reverse-default');
            const result = instance.parse(undefined, parse);

            assert.equal(result, 'parse-default');
        })

        it('Should not set default when value is set', function() {
            const instance = new DefaultTransformer('parse-default', 'reverse-default');
            const result = instance.parse('test1', parse);

            assert.equal(result, 'test1');
        })

        it('Should honor allow-default option', function() {
            const instance = new DefaultTransformer();
            const result = instance.parse(undefined, {
                getOption: function(key) {
                    assert.equal(key, 'allow-default');
                }
            });

            assert.equal(typeof result, 'undefined');
        })
    })

    describe('#reverse', function() {
        it('Should set default when undefined', function() {
            const instance = new DefaultTransformer('parse-default', 'reverse-default');
            const result = instance.reverse(undefined, parse);

            assert.equal(result, 'reverse-default');
        })

        it('Should not set default when value is set', function() {
            const instance = new DefaultTransformer('parse-default', 'reverse-default');
            const result = instance.reverse('test1', parse);

            assert.equal(result, 'test1');
        })

        it('Should honor allow-default option', function() {
            const instance = new DefaultTransformer();
            const result = instance.reverse(undefined, {
                getOption: function(key) {
                    assert.equal(key, 'allow-default');
                }
            });

            assert.equal(typeof result, 'undefined');
        })
    })

});
