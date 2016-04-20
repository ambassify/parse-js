const assert = require('assert');

describe('match', function() {
    let Match = null;

    before(function() {
        Match = require('src/transformers/match');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const regex = /match1/
            const obj = {
                match: Match,
                transform: instance => {
                    assert(instance instanceof Match);
                    assert.equal(instance._match, regex);
                }
            };

            obj.match(regex);
        })
    })

    describe('#parse', function() {
        it('Should parse an object correctly', function() {
            const instance = new Match(/partial/);
            const result = instance.parse({
                partialone: 'test',
                partialtwo: 'abcd',
                something: 'test'
            });

            assert.deepEqual(result, {
                partialone: 'test',
                partialtwo: 'abcd'
            });
        })

        it('Should parse an object correctly with string match', function() {
            const instance = new Match('partial');
            const result = instance.parse({
                partialone: 'test',
                partialtwo: 'abcd',
                something: 'test'
            });

            assert.deepEqual(result, {
                partialone: 'test',
                partialtwo: 'abcd'
            });
        })
    })

    describe('#reverse', function() {
        it('Should reverse an object correctly', function() {
            const instance = new Match(/partial/);
            const result = instance.reverse({
                partialone: 'test',
                partialtwo: 'abcd',
                invalid: 'key'
            });

            assert.deepEqual(result, {
                partialone: 'test',
                partialtwo: 'abcd'
            });
        })
    })
});
