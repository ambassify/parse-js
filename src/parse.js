'use strict';

import _ from 'lodash';
import { realPath } from './utils';

/**
 * Retrieve the value at `path` from `data` and run `parser` on it
 * with `args` as argumens to the parser.
 */
export
function parse( path, parser, data, ...args ) {
    var result = data;

    // Strings always represent paths into `data`.
    if( _.isString(path) ) {
        if( parser.nestsResult )
            path = path.replace(/(^|\.)[^\.]+$/, '');

        result = _.isEmpty(path) ? result : _.get( result, path );

    // Functions can be used to retrieve content from data without a fixed path
    } else if( _.isFunction(path) && !_.isUndefined(result = path(data)) ) {
        // if clause executes function already

    // parse can take in the value directly rather than retrieve it from data.
    } else {
        result = path;
    }


    if( !_.isFunction(parser) )
        throw new Error('Invalid parser supplied to parse()');

    // If path is a function and result is an object we might
    // be dealing with a nested spec.
    if( parser.requiresScalarInput && _.isFunction(path) && _.isPlainObject(result) )
        return _.transform(result, ( r, v, k ) => r[k] = parser(v, ...args), {});


    return parser(result, ...args);
}

/**
 * Perform the reverse operation of `parse`.
 *
 * Convert the data back to the original structure and return it.
 */
export
function reverse( path, reverser, data, ...args ) {

    // If path is a function we might find a function that
    // controls how this value should be reversed.
    if( _.isFunction(path) && _.isFunction(path.reverse) ) {

        let p = realPath(path);

        if (path.reverse.nestsResult && !reverser.nestsResult) {
            data = _.transform(data, ( r, v, k ) => {
                r[k] = reverser( p + '.' + k, v, ...args);
            }, {});
        } else {
            data = reverser( null, data, ...args );
        }

        return path.reverse(data);
    }

    const reversed = reverser( path, data, ...args );

    // Only functions/strings are valid paths, so throw an error
    // if this is not a string.
    if( !_.isString(path) )
        throw new Error('No valid path available');

    // If path is empty, this object belongs at the root of the output.
    if( _.isEmpty(path) )
        return reversed;

    // Set the reversed data at the correct location within the structure.
    const result = {};


    if( reverser.nestsResult && !_.isUndefined(reversed) ) {
        if( reverser.insertsParent ) {
            path = path.split('.');
            path.pop();
            path = path.join('.');
        }

        _.each(reversed, (value, key) => {
            _.set(result, path + '.' + key, value);
        });
    } else if( !_.isUndefined(reversed) )
        _.set(result, path, reversed);

    return result;
}
