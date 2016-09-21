const assert = require('assert');

describe('constant', function() {
    let ConstantTransformer = null;

    before(function() {
        ConstantTransformer = require('src/transformers/constant');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const obj = {
                constant: ConstantTransformer,
                transform: instance => {
                    assert(instance instanceof ConstantTransformer);
                    assert.equal(instance._value, 'this-is-constant');
                    assert.equal(instance._reverseValue, 'this-is-constant');
                }
            };

            obj.constant('this-is-constant');
        })

        it('Should create an instance with new keyword', function() {
            const instance = new ConstantTransformer('this-is-constant', {
                reverseValue: 'this-is-reverse-constant'
            });

            assert(instance instanceof ConstantTransformer);
            assert.equal(instance._value, 'this-is-constant');
            assert.equal(instance._reverseValue, 'this-is-reverse-constant');
        })
    })

    describe('#parse', function() {
        it('Should return the constant', function() {
            const instance = new ConstantTransformer('a-constant');

            assert.equal(instance.parse(), 'a-constant');
            assert.equal(instance.parse({}), 'a-constant');
            assert.equal(instance.parse('some value'), 'a-constant');
        })
    })

    describe('#reverse', function() {
        it('Should return the constant', function() {
            const instance = new ConstantTransformer('a-constant');

            assert.equal(instance.reverse(), 'a-constant');
            assert.equal(instance.reverse({}), 'a-constant');
            assert.equal(instance.reverse('some value'), 'a-constant');
        })

        it('Should return the reverse constant', function() {
            const instance = new ConstantTransformer('a-constant', {
                reverseValue: 'b-constant'
            });

            assert.equal(instance.reverse(), 'b-constant');
            assert.equal(instance.reverse({}), 'b-constant');
            assert.equal(instance.reverse('some value'), 'b-constant');
        })
    })

});
