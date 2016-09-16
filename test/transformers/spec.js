const assert = require('assert');

describe('spec', function() {
    let Spec = null;
    const Parse = function(value, reverse) {
        if (!(this instanceof Parse))
            return new Parse(value, reverse);

        this.parse = function() { return value; };
        this.reverse = function() { return reverse; };
    }

    before(function() {
        Spec = require('src/transformers/spec');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const spec = { 'some': 'key' };
            const obj = {
                spec: Spec,
                transform: instance => {
                    assert(instance instanceof Spec);
                    assert.equal(instance._spec, spec);
                }
            };

            obj.spec(spec);
        })
    })

    describe('#parse', function() {
        it('Should parse an object according to spec', function() {
            const spec = {
                key1: new Parse('key2'),
                key2: new Parse('key1'),
                some: new Parse('thing')
            };
            const instance = new Spec(spec);
            const result = instance.parse({});

            assert.deepEqual(result, {
                key1: 'key2',
                key2: 'key1',
                some: 'thing'
            });
        })

        it('Should recursively parse an object according to spec', function() {
            const spec = {
                key1: new Parse('key2'),
                key2: new Parse('key1'),
                some: {
                    data: new Parse('thing'),
                    value: new Parse('value123')
                }
            };
            const instance = new Spec(spec);
            const result = instance.parse({});

            assert.deepEqual(result, {
                key1: 'key2',
                key2: 'key1',
                some: {
                    data: 'thing',
                    value: 'value123'
                }
            });
        })
    })

    describe('#reverse', function() {
        it('Should reverse an object correctly according to spec', function() {
            const spec = {
                key1: new Parse(null, { key2: 'reverse1' }),
                key2: new Parse(null, null),
                some: {
                    data: new Parse(null, { key3: 'value' }),
                    value: new Parse(null, { key4: 'test' })
                }
            };
            const instance = new Spec(spec);
            const result = instance.reverse({});

            assert.deepEqual(result, {
                key2: 'reverse1',
                key3: 'value',
                key4: 'test'
            });
        })
    })
});
