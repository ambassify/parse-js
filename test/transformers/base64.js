const assert = require('assert');
const Base64 = require('compact-base64');

describe('base64', function() {
    let Base64Transformer = null;

    before(function() {
        Base64Transformer = require('src/transformers/base64');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const obj = {
                base64: Base64Transformer,
                transform: instance => {
                    assert(instance instanceof Base64Transformer);
                    assert.equal(instance._allowBinary, false);
                }
            };

            obj.base64();
        })

        it('Should accept options correctly', function() {
            const obj = {
                base64: Base64Transformer,
                transform: instance => {
                    assert(instance instanceof Base64Transformer);
                    assert.equal(instance._allowBinary, true);
                }
            };

            obj.base64({
                allowBinary: true
            });
        })
    })


    describe('#parse', function() {
        it('Should parse base64 encoded HTML correctly.', function() {
            const instance = new Base64Transformer();
            const result = instance.parse('bG9yZW0gaXBzdW0gPGlmcmFtZT5odG1sIGNvZGU8L2lmcmFtZT4=');
            const output = 'lorem ipsum <iframe>html code</iframe>';

            assert.equal(result, output);
        })

        it('Should parse base64 encoded foreign characters correctly.', function() {
            const instance = new Base64Transformer();
            const result = instance.parse('w6k=');
            const output = 'é';

            assert.equal(result, output);
        })

        it('Should not parse invalid base64', function() {
            const instance = new Base64Transformer();
            const result = instance.parse('abcde');

            assert.equal(result, 'abcde');
        })

        it('Should not validate base64 if binary', function() {
            const instance = new Base64Transformer({
                allowBinary: true
            });
            const result = instance.parse('abcd');

            assert.equal(result, Base64.decode('abcd'));
        })

        it('Should validate base64 if not binary', function() {
            const instance = new Base64Transformer({
                allowBinary: false
            });
            const result = instance.parse('abcd');

            assert.equal(result, 'abcd');
        })

        it('Should validate base64 if not binary', function() {
            const instance = new Base64Transformer({});
            const result = instance.parse('abcd');

            assert.equal(result, 'abcd');
        })
    })

    describe('#reverse', function() {
        it('Should reverse to base64 correctly', function() {
            const instance = new Base64Transformer();

            assert.equal(instance.reverse('test'), 'dGVzdA==');
        })

        it('Should reverse HTML to base64 correctly', function() {
            const instance = new Base64Transformer();

            assert.equal(instance.reverse('<div>test</div>'), 'PGRpdj50ZXN0PC9kaXY+');
        })
    })
});
