const assert = require('assert');

describe('stripPrefix', function() {
    let StripPrefix = null;

    before(function() {
        StripPrefix = require('src/transformers/stripPrefix');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const obj = {
                stripPrefix: StripPrefix,
                transform: instance => {
                    assert(instance instanceof StripPrefix);
                    assert.equal(instance._prefix, 'my-prefix');
                }
            };

            obj.stripPrefix('my-prefix');
        })
    })

    describe('#parse', function() {
        it('Should parse an object correctly', function() {
            const instance = new StripPrefix('my-prefix-');
            const result = instance.parse({
                'my-prefix-key1': 'value',
                'my-prefix-key2': 'abcdef'
            });

            assert.deepEqual(result, {
                key1: 'value',
                key2: 'abcdef'
            });
        })

        it('Should ignore keys without correct prefix', function() {
            const instance = new StripPrefix('my-prefix-');
            const result = instance.parse({
                'my-prefix-key1': 'value',
                'incorrect-prefix-key2': 'abcdef'
            });

            assert.deepEqual(result, {
                key1: 'value'
            });
        })
    })

    describe('#reverse', function() {
        it('Should reverse an object correctly', function() {
            const instance = new StripPrefix('my-prefix-');
            const result = instance.reverse({
                key1: 'value',
                key2: 'abcdef'
            });

            assert.deepEqual(result, {
                'my-prefix-key1': 'value',
                'my-prefix-key2': 'abcdef'
            })
        })
    })
});
