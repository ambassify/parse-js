const _transform = require('lodash/transform');
const _merge = require('lodash/merge');
const _isArray = require('lodash/isArray');

function MapTransformer(callback) {
    if( !(this instanceof MapTransformer) ) {
        return this.transform(new MapTransformer(callback));
    }

    this._callback = callback;
    this._cache = {};
}

MapTransformer.prototype._createParse = (function() {
    const Parse = require('../parse');

    return function(key) {
        const cache = this._cache;

        if (!(key in cache)) {
            cache[key] = this._callback(new Parse(key));
        }

        return cache[key];
    };
}());

MapTransformer.prototype.parse = function(source) {
    const accumulator = _isArray(source) ? [] : {};
    return _transform(source, (result, value, key) => {
        result[key] = this._createParse(key).parse(source);
    }, accumulator);
};

MapTransformer.prototype.reverse = function(source) {
    const isArray = _isArray(source);
    const accumulator = isArray ? [] : {};
    return _transform(source, (result, value, key) => {
        const reverse = this._createParse(key).reverse(source[key]);
        if (isArray)
            result[key] = reverse;
        else
            _merge(result, reverse);
    }, accumulator);
};

module.exports = MapTransformer;
