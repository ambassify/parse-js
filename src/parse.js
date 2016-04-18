const _ = require('lodash');

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

Parse.register('select', require('./parsers/select'));
Parse.register('match', require('./parsers/match'));
Parse.register('rename', require('./parsers/rename'));
Parse.register('map', require('./parsers/map'));
Parse.register('group', require('./parsers/group'));

Parse.register('date', require('./parsers/date'));
Parse.register('multilingual', require('./parsers/multilingual'));
Parse.register('stripPrefix', require('./parsers/stripPrefix'));
