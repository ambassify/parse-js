const assert = require('assert');

describe('array', function() {
    let ArrayTransformer = null;

    before(function() {
        ArrayTransformer = require('src/transformers/array');
    })

    describe('#constructor', function() {
        it('Should contain constans for the mode', function() {
            assert.equal(ArrayTransformer.ANY, 'ANY');
            assert.equal(ArrayTransformer.JSON, 'JSON');
            assert.equal(ArrayTransformer.SEPARATOR, 'SEPARATOR');
        })

        it('Should create an instance without new keyword when attached', function() {
            const obj = {
                array: ArrayTransformer,
                transform: instance => {
                    assert(instance instanceof ArrayTransformer);
                    assert.equal(instance._mode, 'ANY');
                    assert.equal(instance._separator, ',');
                }
            };

            obj.array();
        })

        it('Should accept options correctly', function() {
            const instance = new ArrayTransformer({
                mode: ArrayTransformer.JSON,
                separator: ':'
            });
            assert.equal(instance._mode, 'JSON');
            assert.equal(instance._separator, ':');
        })
    })


    describe('#parse', function() {
        it('Should parse a JSON array correctly', function() {
            const instance = new ArrayTransformer();
            const result = instance.parse('[1,2,4,5]');

            assert.deepEqual(result, [1,2,4,5]);
        })

        it('Should parse an explicit JSON array correctly', function() {
            const instance = new ArrayTransformer({
                mode: ArrayTransformer.JSON
            });
            const result = instance.parse('[1,2,4,5]');

            assert.deepEqual(result, [1,2,4,5]);
        })

        it('Should parse a comma separated array correctly', function() {
            const instance = new ArrayTransformer();
            const result = instance.parse('1,2,4,5');

            assert.deepEqual(result, [1,2,4,5]);
        })

        it('Should parse an explicit comma separated array correctly', function() {
            const instance = new ArrayTransformer({
                mode: ArrayTransformer.SEPARATOR
            });
            const result = instance.parse('1,2,4,5');

            assert.deepEqual(result, [1,2,4,5]);
        })

        it('Should not parse an explicit JSON array', function() {
            const instance = new ArrayTransformer({
                mode: ArrayTransformer.JSON
            });
            const result = instance.parse('1,2,4,5');

            assert.deepEqual(result, []);
        })

        it('Should cast non-string values', function() {
            const instance = new ArrayTransformer();

            assert.deepEqual(instance.parse(123), [123]);
            assert.deepEqual(instance.parse(0), [0]);
        })

        it('Should ignore arrays', function() {
            const instance = new ArrayTransformer();
            const result = instance.parse([123]);

            assert.deepEqual(result, [123]);
        })

        it('Should ignore empty input', function() {
            const instance = new ArrayTransformer();

            assert.deepEqual(instance.parse(''), []);
            assert.deepEqual(instance.parse(null), []);
            assert.deepEqual(instance.parse(false), []);
        })
    })

    describe('#reverse', function() {
        it('Should only reverse arrays', function() {
            const instance = new ArrayTransformer();
            const result = instance.reverse(123);

            assert.equal(result, 123);
        })

        it('Should reverse to JSON by default', function() {
            const instance = new ArrayTransformer();
            const result = instance.reverse([123,654]);

            assert.equal(result, '[123,654]');
        })

        it('Should reverse to JSON', function() {
            const instance = new ArrayTransformer({
                mode: ArrayTransformer.JSON
            });
            const result = instance.reverse([123,654]);

            assert.equal(result, '[123,654]');
        })

        it('Should reverse to list', function() {
            const instance = new ArrayTransformer({
                mode: ArrayTransformer.SEPARATOR
            });
            const result = instance.reverse([123,654]);

            assert.equal(result, '123,654');
        })

        it('Should reverse to list with correct separator', function() {
            const instance = new ArrayTransformer({
                mode: ArrayTransformer.SEPARATOR,
                separator: ':'
            });
            const result = instance.reverse([123,654]);

            assert.equal(result, '123:654');
        })

        it('Invalid modes do nothing', function() {
            const instance = new ArrayTransformer({
                mode: 'INVALID'
            });
            const result = instance.reverse([123,654]);

            assert.deepEqual(result, [123,654]);
        })
    })
});
