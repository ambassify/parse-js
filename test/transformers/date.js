const assert = require('assert');

describe('select', function() {
    let Select = null;

    before(function() {
        Select = require('src/transformers/select');
    })

    describe('#parse', function() {
        it('Should parse an object correctly', function() {
            const instance = new Select('path');
            const result = instance.parse({ path: 'value' });

            assert.equal(result, 'value');
        })
    })

    describe('#reverse', function() {
        it('Should reverse an object correctly', function() {
            const instance = new Select('path');
            const result = instance.reverse('value');

            assert.deepEqual(result, { path: 'value' });
        })
    })
});
