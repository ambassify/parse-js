const _ = require('lodash');

function PathSelector(path) {
    if( !(this instanceof PathSelector) ) {
        return this.transform(new PathSelector(path));
    }

    this._path = path;
}

PathSelector.prototype.parse = function(source) {
    return _.get(source, this._path);
}

PathSelector.prototype.reverse = function(source) {
    const result = {};
    _.set(result, this._path, source);
    return result;
}

module.exports = PathSelector;
