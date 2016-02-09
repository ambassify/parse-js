'use strict';

import _ from 'lodash';
import { Base64 } from 'js-base64';

export
function ucfirst(v) {
    return v.replace(/^[a-z]/, c => c.toUpperCase());
}

export
function lcfirst(v) {
    return v.replace(/^[A-Z]/, c => c.toLowerCase());
}

export
function trim(v) {
    return v.replace(/(^\s+|\s+$)/g, '');
}

const _rBase64 = /^[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/]+=*$/;
const _rNonPrintable = /[\x00-\x08\x0E-\x1F\x80-\xFF]/;
export
function isBase64(v) {
    if (typeof v !== 'string')
        return false;

    if (!_rBase64.test(v))
        return false;

    const value = Base64.decode(v);

    return !_rNonPrintable.test(value);
}

/**
 * Retrieves the original path where the data was extracted.
 *
 * Path can be a nested parser in which case we have to travel up
 * the path chain until we found the string that represents the original path.
 *
 */
export
function realPath(path) {
    let real = path;

    while( _.isFunction(real) )
        real = real.path;

    return real;
}
