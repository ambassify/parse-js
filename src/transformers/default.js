const getDefault = require('../lib/default').getDefault;

function DefaultTransformer(defaultValue, reverseDefaultValue) {
    if( !(this instanceof DefaultTransformer) ) {
        return this.transform(new DefaultTransformer(defaultValue, reverseDefaultValue));
    }

    this._defaultValue = defaultValue;
    this._reverseDefaultValue = reverseDefaultValue;
}

DefaultTransformer.prototype.parse = function(value, parse) {
    if (typeof value !== 'undefined')
        return value;

    return getDefault(parse, this._defaultValue);
};

DefaultTransformer.prototype.reverse = function(value, parse) {
    if (typeof value !== 'undefined')
        return value;

    return getDefault(parse, this._reverseDefaultValue);
};

module.exports = DefaultTransformer;
