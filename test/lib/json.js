const assert = require('assert');

describe('lib/json', function() {
    let JSONLib = null;

    before(function() {
        JSONLib = require('src/lib/json');
    })

    describe('#parse', function() {
        it('Should parse valid JSON', function() {
            const result = JSONLib.parse('{"hello":"world"}');

            assert.deepEqual(result, {hello: 'world'});
        })

        it('Should return null on invalid JSON', function() {
            const result = JSONLib.parse('}{}');

            assert.deepEqual(result, null);
        })

    })
})
