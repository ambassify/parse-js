function StringTransformer(options = {}) {
    if( !(this instanceof StringTransformer) ) {
        return this.transform(new StringTransformer(options));
    }

    this._defaultValue = options.defaultValue;
}

StringTransformer.prototype.parse = function(value) {
    if (typeof value === 'string')
        return value;

    if (typeof value === 'undefined')
        return this._defaultValue;

    return (value + '');
};

StringTransformer.prototype.reverse = function(value) {
    if (typeof value === 'string')
        return value;

    return (value + '');
};

module.exports = StringTransformer;
