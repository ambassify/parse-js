const assert = require('assert');

describe('lib/base64', function() {
    let Base64 = null;

    before(function() {
        Base64 = require('src/lib/base64');
    })

    describe('#isBase64', function() {
        it('Should detect Base64 correctly', function() {
            assert(!Base64.isBase64('abcd'), 'Looks like Base64, content is gibberish');
            assert(!Base64.isBase64('A!Bc'), 'Correct length, invalid characters');
            assert(Base64.isBase64('PGRpdj50ZXN0PC9kaXY+'), 'Valid Base64');
        })

        it('Should check that value is string', function() {
            assert(!Base64.isBase64(true), 'No valid strings');
            assert(!Base64.isBase64(new Date()), 'No valid strings');
        })
    })

    describe('#isBase64SizeCorrect', function() {
        it('Should detect invalid length', function() {
            assert(!Base64.isBase64SizeCorrect('abc'));
            assert(!Base64.isBase64SizeCorrect('abcde'));
            assert(Base64.isBase64SizeCorrect('abcd'));
        })

        it('Should check that value is string', function() {
            assert(!Base64.isBase64SizeCorrect(true), 'No valid strings');
            assert(!Base64.isBase64SizeCorrect(new Date()), 'No valid strings');
        })
    })

    describe('#isBase64FormatCorrect', function() {
        it('Should detect invalid characters', function() {
            assert(!Base64.isBase64FormatCorrect('A!Bc'));
            assert(Base64.isBase64FormatCorrect('abcd'));
        })

        it('Should check that value is string', function() {
            assert(!Base64.isBase64FormatCorrect(true), 'No valid strings');
            assert(!Base64.isBase64FormatCorrect(new Date()), 'No valid strings');
        })
    })

    describe('#isBase64Printable', function() {
        it('Should detect non-printable data', function() {
            assert(!Base64.isBase64Printable('abcd'));
            assert(Base64.isBase64Printable('YQ==')); // a
            assert(Base64.isBase64Printable('w6o=')); // ê
            assert(!Base64.isBase64Printable('gergergerger')); // Passes all format based Base64 checks but is not
        })

        it('Should check that value is string', function() {
            assert(!Base64.isBase64Printable(true), 'No valid strings');
            assert(!Base64.isBase64Printable(new Date()), 'No valid strings');
        })
    })

    describe('#encode', function() {
        it('Should decode UTF-8 correctly', function() {
            assert(Base64.encode('💩'), '8J+SqQ==');
        })
    })
});
