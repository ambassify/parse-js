const _ = require('lodash');

function Matcher(match) {
    if( !(this instanceof Matcher) ) {
        return this.transform(new Matcher(match));
    }

    if( typeof match === 'string' ) {
        // Escape string
        match = match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        match = new RegExp(match);
    }

    this._match = match;
}

Matcher.prototype.parse = function(source) {
    return _.transform(source, (result, value, key) => {
        if( this._match.test(key) )
            result[key] = value;
    }, {});
}

Matcher.prototype.reverse = Matcher.prototype.parse;

module.exports = Matcher;
