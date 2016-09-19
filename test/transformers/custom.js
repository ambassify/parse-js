const assert = require('assert');

describe('custom', function() {
    let CustomTransformer = null;

    before(function() {
        CustomTransformer = require('src/transformers/custom');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const parse = function() {};
            const reverse = function() {};

            const obj = {
                custom: CustomTransformer,
                transform: instance => {
                    assert(instance instanceof CustomTransformer);
                    assert.equal(instance.parse, parse);
                    assert.equal(instance.reverse, reverse);
                }
            };

            obj.custom(parse, reverse);
        })

        it('Should create an instance with new keyword', function() {
            const parse = function() {};
            const reverse = function() {};

            const instance = new CustomTransformer(parse, reverse);

            assert(instance instanceof CustomTransformer);
            assert.equal(instance.parse, parse);
            assert.equal(instance.reverse, reverse);
        })
    })
});
