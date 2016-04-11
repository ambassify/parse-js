const _ = require('lodash');

function StripPrefix(prefix) {
    if( !(this instanceof StripPrefix) ) {
        return this.transform(new StripPrefix(prefix));
    }

    this._prefix = prefix;
}

StripPrefix.prototype.parse = function(source) {
    const prefix = this._prefix;
    const length = prefix.length;

    return _.transform(source, (result, value, key) => {
        if( key.indexOf(prefix) !== 0 ) return;

        result[key.substr(length)] = value;
    }, {});
}

StripPrefix.prototype.reverse = function(source) {
    const prefix = this._prefix;
    return _.transform(source, (result, value, key) => {
        result[prefix + key] = value;
    }, {});
}

module.exports = StripPrefix;
