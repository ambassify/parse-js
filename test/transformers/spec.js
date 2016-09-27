const assert = require('assert');
const _ = require('lodash');

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
            const spec = { 'some': new Parse('value', 'reverse') };
            const obj = {
                spec: Spec,
                transform: instance => {
                    assert(instance instanceof Spec);
                    assert.deepEqual(instance._spec, spec);
                }
            };

            obj.spec(spec);
        })

        it('Should convert strings to parse().select() parsers.', function() {
            const parser = new Parse('parse', 'reverse');
            const instance = new Spec({
                key: 'test',
                some: parser,
                value: {
                    a: 'a'
                }
            });

            const spec = instance._spec;

            assert.equal(typeof spec.key, 'object');
            assert.equal(typeof spec.key.parse, 'function');
            assert.equal(typeof spec.key.reverse, 'function');

            assert.equal(typeof spec.value, 'object');
            assert.equal(typeof spec.value.a, 'object');
            assert.equal(typeof spec.value.a.parse, 'function');
            assert.equal(typeof spec.value.a.reverse, 'function');

            assert.ok(spec.some instanceof Parse);
            assert.equal(spec.some, parser);
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
        it('Should provide correct value to reverser', function() {
            const obj = {
                key1: 'test',
                key2: 'test',
                some: {
                    data: 'a',
                    value: 'c'
                }
            };

            const ValidateParse = (key) => {
                const p = new Parse(null, null);
                p.reverse = function(v) {
                    const result = _.get(obj, key);
                    assert.deepEqual(v, result);
                    return result;
                }
                return p;
            };

            const spec = {
                key1: ValidateParse('key1'),
                key2: ValidateParse('key2'),
                some: {
                    data: ValidateParse('some.data'),
                    value: ValidateParse('some.value')
                }
            };
            const instance = new Spec(spec);
            const result = instance.reverse(obj);
        })
    })
});
