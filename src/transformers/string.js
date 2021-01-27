'use strict';

const getDefault = require('../lib/default').getDefault;

function StringTransformer(options = {}) {
    if( !(this instanceof StringTransformer) ) {
        return this.transform(new StringTransformer(options));
    }

    this._defaultValue = options.defaultValue;
    this._reverseDefaultValue = options.reverseDefaultValue;
}

StringTransformer.prototype.parse = function(value, parse) {
    if (typeof value === 'string')
        return value;

    if (typeof value === 'undefined')
        return getDefault(parse, this._defaultValue);

    return (value + '');
};

StringTransformer.prototype.reverse = function(value, parse) {
    if (typeof value === 'undefined')
        return getDefault(parse, this._reverseDefaultValue);

    if (typeof value === 'string')
        return value;

    return (value + '');
};

module.exports = StringTransformer;
