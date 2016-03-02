'use strict';

import _ from 'lodash';
import { Base64 } from 'js-base64';
import { ucfirst } from './utils';

const CAMELCASE = 'camelCase';
const prefixUnderscore = ( x => '_' + x );

export
function multilingual( path, data, name, parseType = CAMELCASE ) {
    const languageTransform = ( parseType == CAMELCASE ) ? ucfirst : prefixUnderscore;
    return _.transform(data, (output, value, lang) => {
        const key = name + languageTransform(lang);
        output[key] = value;
    }, {});
}

export
function groupingMultilingual( path, data, name = null, parseType = CAMELCASE, languages = [] ) {
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

export
function number(value, NaNValue = 0) {
    return isNaN(value) ? NaNValue : value;
}

export
function base64(path, value) {
    if( _.isPlainObject(value) )
        return _.transform(value, (r, v, k) => r[k] = base64(null, v), {});

    return Base64.encode(value);
}

export
function json(path, value) {
    return JSON.stringify(value);
}
