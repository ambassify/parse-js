const _ = require('lodash');

function Rename(parser, reverser) {
    if( !(this instanceof Rename) ) {
        return this.transform(new Rename(parser, reverser));
    }

    this._parser = parser;
    this._reverser = reverser;
}

Rename.prototype.parse = function(source) {
    return _.transform(source, (result, value, key) => {
        key = this._parser(key, value);
        result[key] = value;
    }, {});
}

Rename.prototype.reverse = function(source) {
    return _.transform(source, (result, value, key) => {
        key = this._reverser(key, value);
        result[key] = value;
    }, {});
}

module.exports = Rename;
