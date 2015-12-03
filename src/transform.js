'use strict';

import _ from 'lodash';

/**
 * Transform old format data to new format data using the specified
 * specifications.
 */
export
function transform( spec, data ) {
    if( _.isUndefined(spec) || spec === null || spec === false )
        return data;

    if( _.isFunction(spec) )
        return spec(data);

    if( _.isString(spec) )
        return _.get( data, spec, null );

    const obj = {};

    _.each( spec, (format, key) => {
        var content = transform( format, data );

        if( !_.isUndefined(content) )
            obj[key] = content;
    });

    return obj;
}

/**
 * Transform old format data to new format data using the specified
 * specifications.
 */
export
function reverseTransform( spec, data, target = null ) {
    if( spec.reverse && _.isFunction(spec.reverse) ) {
        data = spec.reverse(data);
        return _.merge(target, data);
    }

    if( _.isFunction(spec) && spec.path )
        spec = spec.path;

    if( _.isString(spec) ) {
        const v = _.get(target, spec, null);
        if( _.isObject(v) && _.isObject(data) )
            data = _.merge({}, v, data);
        return _.set( target, spec, data );
    }

    const obj = target || {};

    _.each( spec, (format, key) => {
        if( !_.isUndefined(data[key]) )
            reverseTransform( format, data[key], obj );
    });

    return obj;
}
