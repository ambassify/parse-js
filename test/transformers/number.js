const assert = require('assert');

describe('number', function() {
    let NumberTransformer = null;

    before(function() {
        NumberTransformer = require('src/transformers/number');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const obj = {
                number: NumberTransformer,
                transform: instance => {
                    assert(instance instanceof NumberTransformer);
                    assert.equal(instance._NaNValue, 0);
                    assert.equal(typeof instance._normalizer, 'function');
                    assert.equal(instance._base, 10);

                    assert.equal(instance._normalizer('10.100,20'), '10100.20');
                    assert.equal(instance._normalizer('2,100,100.30'), '2100100.30');
                    assert.equal(instance._normalizer(1000.1), 1000.1);
                }
            };

            obj.number();
        })

        it('Should accept options correctly', function() {
            const normalizer = function() {};

            const obj = {
                number: NumberTransformer,
                transform: instance => {
                    assert(instance instanceof NumberTransformer);
                    assert.equal(instance._NaNValue, 11);
                    assert.equal(instance._normalizer, normalizer);
                    assert.equal(instance._base, 2);
                }
            };

            obj.number({
                normalizer,
                base: 2,
                NaNValue: 11
            });
        })
    })


    describe('#parse', function() {
        it('Should parse normal integer', function() {
            const instance = new NumberTransformer();
            const result = instance.parse(10);

            assert.equal(result, 10);
        })

        it('Should parse normal floats', function() {
            const instance = new NumberTransformer();
            const result = instance.parse(10.20);

            assert.equal(result, 10.20);
        })

        it('Should parse integer numbers in strings', function() {
            const instance = new NumberTransformer();
            const result = instance.parse('14');

            assert.equal(result, 14);
        })

        it('Should parse float numbers in strings', function() {
            const instance = new NumberTransformer();
            const result = instance.parse('55.222,123');

            assert.equal(result, 55222.123);
        })

        it('Should parse invalid input', function() {
            const instance = new NumberTransformer();
            const result = instance.parse(null);

            assert.equal(result, 0);
        })

        it('Should be able to detect decimal separator', function () {
            const instance = new NumberTransformer();

            assert.equal(instance.parse('99.99'), 99.99);
            assert.equal(instance.parse('99,99'), 99.99);
            assert.equal(instance.parse('99,999,999'), 99999999);
            assert.equal(instance.parse('99.999.999'), 99999999);
            assert.equal(instance.parse('99,999,999.99'), 99999999.99);
            assert.equal(instance.parse('99.999.999,99'), 99999999.99);

            // these are ambiguous, we're choosing to prefer parsing as a decimal
            // separator when there is onle one dot or comma
            assert.equal(instance.parse('9,999'), 9.999);
            assert.equal(instance.parse('9.999'), 9.999);
        })

        it('Should let you choose decimal separator', function () {
            const instance = new NumberTransformer({ decimalSeparator: ',' });
            const result = instance.parse('55.23');

            assert.equal(result, 5523);
        })

        it('Should use correct NaNValue', function() {
            const instance = new NumberTransformer();
            const result = instance.parse('not-a-number');

            assert.equal(result, 0);
        })

        it('Should use correct custom NaNValue', function() {
            const instance = new NumberTransformer({
                NaNValue: 12345
            });
            const result = instance.parse('not-a-number');

            assert.equal(result, 12345);
        })

        it('Should read the value in the correct base (hex)', function() {
            const instance = new NumberTransformer({
                base: 16
            });
            const result = instance.parse('A1');

            assert.equal(result, 161);
        })

        it('Should read the value in the correct base (binary)', function() {
            const instance = new NumberTransformer({
                base: 2
            });
            const result = instance.parse('111');

            assert.equal(result, 7);
        })
    })

    describe('#reverse', function() {
        it('Should reverse to correct base (hex)', function() {
            const instance = new NumberTransformer({
                base: 16
            });
            const result = instance.reverse(161);

            assert.equal(result, 'a1');
        })

        it('Should reverse to correct base (binary)', function() {
            const instance = new NumberTransformer({
                base: 2
            });
            const result = instance.reverse(7);

            assert.equal(result, '111');
        })

        it('Should leave decimal numbers untouched', function() {
            const instance = new NumberTransformer();
            const result = instance.reverse(7);

            assert.equal(result, 7);
        })
    })
});
