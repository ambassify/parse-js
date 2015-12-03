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

