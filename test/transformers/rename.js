const assert = require('assert');

describe('rename', function() {
    let Rename = null;

    const noop = function() {};

    before(function() {
        Rename = require('src/transformers/rename');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const parser = function() {};
            const reverser = function() {};

            const obj = {
                rename: Rename,
                transform: instance => {
                    assert(instance instanceof Rename);
                    assert.equal(instance._parser, parser);
                    assert.equal(instance._reverser, reverser);
                }
            };

            obj.rename(parser, reverser);
        })
    })

    describe('#parse', function() {
        it('Should rename a field correctly', function() {
            const parser = function(k, v) {
                assert.equal(k, 'oldkey');
                assert.equal(v, 'value');

                return 'newkey';
            };
            const instance = new Rename(parser, noop);
            const result = instance.parse({ oldkey: 'value' });

            assert.ok(result['newkey']);
            assert.equal(result['newkey'], 'value');
        })
    })

    describe('#reverse', function() {
        it('Should reverse renaming of a field correctly', function() {
            const reverser = function(k, v) {
                assert.equal(k, 'newkey');
                assert.equal(v, 'value');

                return 'oldkey';
            };
            const instance = new Rename(noop, reverser);
            const result = instance.reverse({ 'newkey': 'value' });

            assert.ok(result['oldkey']);
            assert.equal(result['oldkey'], 'value');
        })
    })
});
