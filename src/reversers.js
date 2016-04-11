'use strict';

import _ from 'lodash';
import { Base64 } from 'js-base64';
import { ucfirst } from './utils';

const CAMELCASE = 'camelCase';
const prefixUnderscore = ( x => '_' + x );

export
function multilingual( path, data, parseType = CAMELCASE ) {
    if( !_.isPlainObject(data) )
        return data;

    const name = (path || '').split('.').pop();
    const languageTransform = ( parseType == CAMELCASE ) ? ucfirst : prefixUnderscore;
    return _.transform(data, (output, value, lang) => {
        const key = name + languageTransform(lang);
        output[key] = value;
    }, {});
}
multilingual.nestsResult = true;
multilingual.insertsParent = true;

export
function groupingMultilingual( path, data, parseType = CAMELCASE, languages = [] ) {
    if( !_.isPlainObject(data) )
        return data;

    if( _.difference(_.keys(data), languages).length < 1 )
        return multilingual(path, data, parseType);

    const languageTransform = ( parseType == CAMELCASE ) ? ucfirst : prefixUnderscore;
    return _.transform(data, (output, values, key) => {
        if( !_.isObject(values) || _.difference(_.keys(values), languages).length > 0 ) {
            output[key] = values;
            return;
        }

        _.each(values, (value, lang) => {
            output[key + languageTransform(lang)] = value;
        });
    }, {});
}
groupingMultilingual.nestsResult = true;
groupingMultilingual.insertsParent = true;

export
function date( path, v ) {
    return _.isDate(v) ? v.toJSON() : v;
}

export
function array( path, value ) {
    if( _.isPlainObject(value) )
        return _.transform(value, (r, v, k) => r[k] = array(null, v), {});

    return JSON.stringify(value);
}

export
function equals( path, value, shouldEqual, notEqualReverseValue = undefined ) {
    // returning undefined causes no value to be changed.
    return value ? shouldEqual : notEqualReverseValue;
}

export
function matchPrefixStrip( path, data, key, restoreCamelCase ) {
    return _.transform(data, (r, v, k) => {
        const suffix = restoreCamelCase ? ucfirst(k) : k;
        r[key + suffix] = v;
    }, {});
}
matchPrefixStrip.nestsResult = true;

export
function number(value, NaNValue = 0) {
    return isNaN(value) ? NaNValue : value;
}

export
function base64(path, value) {
    return Base64.encode(value);
}

export
function json(path, value) {
    return JSON.stringify(value);
}

export
function boolean(path, value) {
    return typeof value === 'string' ?
        _.contains(['1', 'true', 'yes'], value) :
        !!value;
}
