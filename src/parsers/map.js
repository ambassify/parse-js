const _ = require('lodash');

function Map(callback) {
    if( !(this instanceof Map) ) {
        return this.transform(new Map(callback));
    }

    this._callback = callback;
}

Map.prototype._createParse = (function() {
    const cache = {};
    const Parse = require('../parse');

    return function(key) {
        if (!(key in cache)) {
            cache[key] = this._callback(new Parse(key));
        }

        return cache[key];
    };
}());

Map.prototype.parse = function(source) {
    return _.transform(source, (result, value, key) => {
        result[key] = this._createParse(key).parse(source);
    }, {});
}

Map.prototype.reverse = function(source) {
    return _.transform(source, (result, value, key) => {
        _.merge(result, this._createParse(key).reverse(source[key]));
    }, {});
}

module.exports = Map;
