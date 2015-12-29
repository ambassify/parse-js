'use strict';

import _ from 'lodash';

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

let _rBase64;
export
function isBase64(v) {
    if (typeof v !== 'string')
        return false;

    if (!_rBase64)
        _rBase64 = /^[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/]+=*$/;

    return _rBase64.test(v);
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
