const _ = require('lodash');

function DateParser(nowOnInvalid = false) {
    if( !(this instanceof DateParser) ) {
        return this.transform(new DateParser(nowOnInvalid));
    }

    this._nowOnInvalid = nowOnInvalid;
}

DateParser.prototype.parse = function(value) {
    const parsedDate = new Date(value);
    if (parsedDate.toString() != INVALID_DATE)
        return parsedDate;

    if (this._nowOnInvalid)
        return new Date();

    return undefined;
}

DateParser.prototype.reverse = function(source) {
    if (typeof source instanceof Date && source.toJSON)
        return source.toJSON();

    return source;
}

module.exports = DateParser;
