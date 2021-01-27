'use strict';

const _transform = require('../lib/transform');
const _merge = require('lodash/merge');
const _isArray = require('lodash/isArray');

function MapTransformer(callback, parse) {
    if( !(this instanceof MapTransformer) ) {
        return this.transform(new MapTransformer(callback, this.constructor));
    }

    this._parse = parse || require('../index');
    this._callback = callback;
    this._cache = {};
}

MapTransformer.prototype._createParse = function(key) {
    const parse = this._parse;
    const cache = this._cache;

    if (!(key in cache)) {
        cache[key] = this._callback(parse().select(key));
    }

    return cache[key];
};

MapTransformer.prototype.parse = function(source, instance, root) {
    const accumulator = _isArray(source) ? [] : {};
    return _transform(source, (result, value, key) => {
        result[key] = this._createParse(key).parse(source, instance, root);
    }, accumulator);
};

MapTransformer.prototype.reverse = function(source, instance, root) {
    const isArray = _isArray(source);
    const accumulator = isArray ? [] : {};
    return _transform(source, (result, value, key) => {
        const reverse = this._createParse(key).reverse(source[key], instance, root);
        if (isArray)
            result[key] = reverse[key];
        else
            _merge(result, reverse);
    }, accumulator);
};

module.exports = MapTransformer;
