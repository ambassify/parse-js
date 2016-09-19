const assert = require('assert');

describe('lib/base64', function() {
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
