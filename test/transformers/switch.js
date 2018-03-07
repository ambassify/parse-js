const assert = require('assert');

describe('switch', function() {
    let Switch = null;

    before(function() {
        Switch = require('src/transformers/switch');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const cases = {};
            const obj = {
                switch: Switch,
                transform: instance => {
                    assert(instance instanceof Switch);
                    assert.equal(typeof instance._parseSelector, 'function');
                    assert.equal(typeof instance._reverseSelector, 'function');
                }
            };

            obj.switch(cases, 'obj.parse', 'obj.reverse');
        })
    })

    describe('#parse', function() {
        it('Should parse an object correctly', function() {
            const instance = new Switch({
                'not-this': {},
                'value': {
                    parse: () => 'correct'
                },
                'not-this-either': {}
            }, 'path');

            const result = instance.parse({ path: 'value' });

            assert.equal(result, 'correct');
        })
    })

    describe('#reverse', function() {
        it('Should reverse an object correctly', function() {
            const instance = new Switch({
                'not-this': {},
                'value': {
                    reverse: () => 'correct'
                },
                'not-this-either': {}
            }, 'path', () => 'value');

            const result = instance.reverse('value');

            assert.equal(result, 'correct');
        })
    })

    describe('#default', function() {
        it('Should attempt to use the _default_ case', function() {
            const instance = new Switch({
                'not-this': {},
                'not-this-either': {},
                '_default_': {
                    parse: () => 'correct'
                }
            }, 'path');

            const result = instance.parse({ path: 'value' });

            assert.equal(result, 'correct');
        })
    })

    describe('#no default', function() {
        it('Should return undefined on missing case', function() {
            const instance = new Switch({
                'not-this': {},
                'not-this-either': {}
            }, 'path');

            const result = instance.parse({ path: 'value' });

            assert.equal(typeof result, 'undefined');
        })
    })

    describe('#disabled selector', function() {
        it('Should return undefined on missing case', function() {
            const instance = new Switch({
                'not-this': {},
                'not-this-either': {}
            }, null, null);

            const result = instance.parse({ path: 'value' });

            assert.equal(typeof result, 'undefined');
        })
    })
});
