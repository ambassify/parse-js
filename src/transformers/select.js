const _get = require('lodash/get');
const _set = require('lodash/set');

function SelectTransformer(path) {
    if( !(this instanceof SelectTransformer) ) {
        return this.transform(new SelectTransformer(path));
    }

    this._path = path;
}

SelectTransformer.prototype.parse = function(source) {
    return _get(source, this._path);
};

SelectTransformer.prototype.reverse = function(source) {
    if (typeof source === 'undefined')
        return source;

    return _set({}, this._path, source);
};

module.exports = SelectTransformer;
