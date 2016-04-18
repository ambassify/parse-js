const _ = require('lodash');

const options = {};

function Parse(path, options = {}) {
    if (!(this instanceof Parse))
        return new Parse(path);

    this._chain = [];
    this._options = options;

    return this.select(path);
}

module.exports = Parse;

Parse.register = function(name, handler, { overwrite = false } = {}) {
    if( !overwrite && Parse.prototype[name] )
        throw new Error(`${name} already has a handler.`);

    Parse.prototype[name] = handler;
}

Parse.setOption = function(key, value) {
    _.set(options, key, value);
    return Parse;
}

Parse.getOption = function(key) {
    return _.get(options, key);
}

Parse.prototype.setOption = function(key, value) {
    _.set(this._options, key, value);
    return this;
}

Parse.prototype.getOption = function(key) {
    return _.get(this._options, key, Parse.getOption(key));
}

Parse.prototype.transform = function(parser, reverser) {
    if (typeof parser !== 'object') {
        parser = { parser, reverser };
    }

    this._chain = this._chain.concat(parser);

    return this;
}

Parse.prototype.parse = function(obj) {
    const len = this._chain.length;

    for (let i=0; i<len; i++)
        obj = this._chain[i].parse(obj);

    return obj;
}

Parse.prototype.reverse = function(obj) {
    let i = this._chain.length;

    while( i-- ) {
        obj = this._chain[i].reverse(obj);
    }

    return obj;
}

Parse.register('select', require('./transformers/select'));
Parse.register('match', require('./transformers/match'));
Parse.register('rename', require('./transformers/rename'));
Parse.register('map', require('./transformers/map'));
Parse.register('group', require('./transformers/group'));

Parse.register('date', require('./transformers/date'));
Parse.register('multilingual', require('./transformers/multilingual'));
Parse.register('stripPrefix', require('./transformers/stripPrefix'));
