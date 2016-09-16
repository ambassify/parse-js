const _transform = require('lodash/transform');
const _merge = require('lodash/merge');

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
    return _transform(source, (result, value, key) => {
        result[key] = this._createParse(key).parse(source);
    }, {});
};

MapTransformer.prototype.reverse = function(source) {
    return _transform(source, (result, value, key) => {
        _merge(result, this._createParse(key).reverse(source[key]));
    }, {});
};

module.exports = MapTransformer;
