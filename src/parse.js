const _ = require('lodash');
const CustomTransformer = require('./transformers/custom');

function Parse(path, options = {}) {
    if (!(this instanceof Parse))
        return new Parse(path);

    this._chain = [];
    this._options = options;

    if (_.isString(path))
        return this.select(path);

    return this;
}

module.exports = Parse;

Parse.options = {};

Parse.register = function(name, handler, { overwrite = false } = {}) {
    if( !overwrite && Parse.prototype[name] )
        throw new Error(`${name} already has a handler.`);

    Parse.prototype[name] = handler;
};

Parse.setOption = function(key, value) {
    _.set(Parse.options, key, value);
    return Parse;
};

Parse.getOption = function(key) {
    return _.get(Parse.options, key);
};

Parse.prototype.setOption = function(key, value) {
    _.set(this._options, key, value);
    return this;
};

Parse.prototype.getOption = function(key) {
    return _.get(this._options, key, Parse.getOption(key));
};

Parse.prototype.transform = function(parse, reverse) {
    if (typeof parse !== 'object') {
        parse = new CustomTransformer(parse, reverse);
    }

    this._chain = this._chain.concat(parse);

    return this;
};

Parse.prototype.parse = function(obj) {
    const len = this._chain.length;

    for (let i = 0; i < len; i++)
        obj = this._chain[i].parse(obj);

    return obj;
};

Parse.prototype.reverse = function(obj) {
    let i = this._chain.length;

    while( i-- ) {
        obj = this._chain[i].reverse(obj);
    }

    return obj;
};

Parse.register('select', require('./transformers/select'));
Parse.register('match', require('./transformers/match'));
Parse.register('rename', require('./transformers/rename'));
Parse.register('map', require('./transformers/map'));
Parse.register('group', require('./transformers/group'));

Parse.register('spec', require('./transformers/spec'));
Parse.register('date', require('./transformers/date'));
Parse.register('bool', require('./transformers/bool'));
Parse.register('base64', require('./transformers/base64'));
Parse.register('multilingual', require('./transformers/multilingual'));
Parse.register('stripPrefix', require('./transformers/stripPrefix'));
