const Base64 = require('compact-base64');

const _rBase64 = /^[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/]+=*$/;
const _rNonPrintable = /[\x00-\x08\x0E-\x1F\x7F\x80-\x9F]/;

function isBase64(v) {
    if (typeof v !== 'string')
        return false;

    if ((v.length * 6) % 8 !== 0)
        return false;

    if (!_rBase64.test(v))
        return false;

    const value = Base64.decode(v);

    return !_rNonPrintable.test(value);
}

module.exports = {
    isBase64,
    encode: Base64.encode,
    decode: Base64.decode
};
