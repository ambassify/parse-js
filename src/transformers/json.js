'use strict';

const parseJSON = require('../lib/json').parse;
const getDefault = require('../lib/default').getDefault;
const isDefaultEnabled = require('../lib/default').isDefaultEnabled;

function JSONTransformer(options = {}) {
    if( !(this instanceof JSONTransformer) ) {
        return this.transform(new JSONTransformer(options));
    }

    this._defaultValue = options.defaultValue;
}

JSONTransformer.prototype.parse = function(value, parse) {
    if (typeof value !== 'string')
        return value;

    const result = parseJSON(value);
    if (result !== null)
        return result;

    return getDefault(parse, this._defaultValue, result);
};

JSONTransformer.prototype.reverse = function(value, parse) {
    if (isDefaultEnabled(parse))
        return JSON.stringify(value);

    if (typeof value === 'undefined')
        return (void 0);

    return JSON.stringify(value);
};

module.exports = JSONTransformer;
