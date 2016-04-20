const _ = require('lodash');

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
    return _.transform(source, (result, value, key) => {
        result[key] = this._createParse(key).parse(source);
    }, {});
}

MapTransformer.prototype.reverse = function(source) {
    return _.transform(source, (result, value, key) => {
        _.merge(result, this._createParse(key).reverse(source[key]));
    }, {});
}

module.exports = MapTransformer;
