'use strict';

const _get = require('lodash/get');
const _set = require('lodash/set');
const Parse = require('../parse');

function SelectTransformer(path, { mode } = {}) {
    if (this instanceof Parse && !mode)
        mode = this.getOption(Parse.OPT_SELECT_MODE);

    if (!mode)
        mode = Parse.SELECT_MODE_LODASH;

    if (!(this instanceof SelectTransformer))
        return this.transform(new SelectTransformer(path, { mode }));

    if (mode === Parse.SELECT_MODE_JS)
        path = `["${path}"]`;

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
