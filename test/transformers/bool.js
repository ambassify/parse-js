const assert = require('assert');

describe('bool', function() {
    let BooleanTransformer = null;

    before(function() {
        BooleanTransformer = require('src/transformers/bool');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const obj = {
                bool: BooleanTransformer,
                transform: instance => {
                    assert(instance instanceof BooleanTransformer);
                    assert.equal(typeof instance._defaultValue, 'undefined');
                    assert.equal(instance._reverseTo, 'BOOLEAN');
                }
            };

            obj.bool();
        })

        it('Should accept options correctly', function() {
            const obj = {
                bool: BooleanTransformer,
                transform: instance => {
                    assert(instance instanceof BooleanTransformer);
                    assert.equal(instance._defaultValue, true);
                    assert.equal(instance._reverseTo, 'NUMBER');
                }
            };

            obj.bool({
                defaultValue: true,
                reverseTo: 'NUMBER'
            });
        })
    })


    describe('#parse', function() {
        it('Should parse truthy values correctly', function() {
            const instance = new BooleanTransformer();

            assert.equal(instance.parse('true'), true);
            assert.equal(instance.parse('1'), true);
            assert.equal(instance.parse('yes'), true);
            assert.equal(instance.parse('y'), true);
            assert.equal(instance.parse(1), true);
            assert.equal(instance.parse(2), true);
            assert.equal(instance.parse(true), true);
        })

        it('should parse falsey values correctly', function() {
            const instance = new BooleanTransformer();

            assert.equal(instance.parse('false'), false);
            assert.equal(instance.parse('0'), false);
            assert.equal(instance.parse('no'), false);
            assert.equal(instance.parse('n'), false);
            assert.equal(instance.parse('nope'), false);
            assert.equal(instance.parse(0), false);
            assert.equal(instance.parse(-0), false);
            assert.equal(instance.parse(false), false);
        })

        it('should parse using correct defaultvalue', function() {
            let instance;

            instance = new BooleanTransformer({
                defaultValue: true
            });

            assert.equal(instance.parse(undefined), true);

            instance = new BooleanTransformer({
                defaultValue: false
            });

            assert.equal(instance.parse(undefined), false);
        })
    })

    describe('#reverse', function() {
        it('Should reverse to boolean correctly', function() {
            const instance = new BooleanTransformer();

            assert.equal(instance.reverse(true), true);
            assert.equal(instance.reverse(false), false);
        })

        it('Should reverse to boolean correctly as string', function() {
            const instance = new BooleanTransformer({
                reverseTo: 'STRING'
            });

            assert.equal(instance.reverse(true), 'true');
            assert.equal(instance.reverse(false), 'false');
        })

        it('Should reverse to boolean correctly as number', function() {
            const instance = new BooleanTransformer({
                reverseTo: 'NUMBER'
            });

            assert.equal(instance.reverse(true), 1);
            assert.equal(instance.reverse(false), 0);
        })
    })
});
