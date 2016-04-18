const _ = require('lodash');

function SelectTransformer(path) {
    if( !(this instanceof SelectTransformer) ) {
        return this.transform(new SelectTransformer(path));
    }

    this._path = path;
}

SelectTransformer.prototype.parse = function(source) {
    return _.get(source, this._path);
}

SelectTransformer.prototype.reverse = function(source) {
    const result = {};
    _.set(result, this._path, source);
    return result;
}

module.exports = SelectTransformer;
