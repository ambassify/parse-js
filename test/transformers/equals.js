const assert = require('assert');

describe('equals', function() {
    let EqualsTransformer = null;

    before(function() {
        EqualsTransformer = require('src/transformers/equals');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const obj = {
                equals: EqualsTransformer,
                transform: instance => {
                    assert(instance instanceof EqualsTransformer);
                    assert.equal(instance._match, 'abc', 'set value to match');
                    assert.equal(instance._strict, false, 'set strict compare');
                    assert.equal(instance._reverse, 'abc', 'set reverse value');
                }
            };

            obj.equals('abc');
        })

        it('Should create an instance with new keyword', function() {
            const instance = new EqualsTransformer('test', {
                reverse: 'def',
                strict: true
            });

            assert(instance instanceof EqualsTransformer);
            assert.equal(instance._match, 'test');
            assert.equal(instance._strict, true);
            assert.equal(instance._reverse, 'def');
        })
    })

    describe('#parse', function() {
        it('Should match using a regex', function() {
            const instance = new EqualsTransformer(/^ab?c$/);

            assert.ok(instance.parse('ac'));
            assert.ok(instance.parse('abc'));
            assert.ok(!instance.parse('ab'));
        })

        it('Should match using a function', function() {
            const instance = new EqualsTransformer(function(v) {
                return v == 'test';
            });

            assert.ok(instance.parse('test'));
            assert.ok(!instance.parse('abc'));
        })

        it('Should match strict', function() {
            const instance = new EqualsTransformer(1234, {
                strict: true
            });

            assert.ok(instance.parse(1234));
            assert.ok(!instance.parse('1234'));
        })

        it('Should match non-strict', function() {
            const instance = new EqualsTransformer(1234);

            assert.ok(instance.parse(1234));
            assert.ok(instance.parse('1234'));
        })
    })

    describe('#reverse', function() {
        it('Should return reverse value', function() {
            const instance = new EqualsTransformer(1234);

            assert.equal(instance.reverse(true), 1234);
            assert.equal(instance.reverse(false), null);
        })

        it('Should return reverse value', function() {
            const instance = new EqualsTransformer(1234, {
                reverse: '6543'
            });

            assert.equal(instance.reverse(true), '6543');
            assert.equal(instance.reverse(false), null);
        })
    })

});
