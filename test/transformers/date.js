const assert = require('assert');

describe('date', function() {
    let DateTransformer = null;

    before(function() {
        DateTransformer = require('src/transformers/date');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const obj = {
                date: DateTransformer,
                transform: instance => {
                    assert(instance instanceof DateTransformer);
                    assert.equal(instance._nowOnInvalid, true);
                }
            };

            obj.date(true);
        })
    })


    describe('#parse', function() {
        it('Should parse a date correctly', function() {
            const instance = new DateTransformer();
            const result = instance.parse('6-6-2006');

            assert.deepEqual(result, new Date('6-6-2006'));
        })

        it('Should fail on an invalid date', function() {
            const instance = new DateTransformer();
            const result = instance.parse('something invalid');

            assert.equal(result, undefined);
        })

        it('Should return now on invalid', function() {
            const instance = new DateTransformer(true);
            const result = instance.parse('something invalid');

            assert.deepEqual(result, new Date());
        })
    })

    describe('#reverse', function() {
        it('Should reverse a date correctly', function() {
            const date = new Date( Date.now() - 2000 );
            const instance = new DateTransformer();
            const result = instance.reverse(date);

            assert.equal(result, date.toJSON());
        })

        it('Should pass through non-date values', function() {
            const date = Date.now() - 2000;
            const instance = new DateTransformer();
            const result = instance.reverse(date);

            assert.equal(result, date);
        })
    })
});
