const _ = require('lodash');

function GroupTransformer(regex, key, index) {
    if( !(this instanceof GroupTransformer) ) {
        return this.transform(new GroupTransformer(regex, key, index));
    }

    this._regex = regex;
    this._key = key;
    this._index = index;
}

GroupTransformer.prototype.match = function(key) {
    this._regex.lastIndex = 0;
    return this._regex.exec(key);
};

GroupTransformer.prototype.parse = function(source) {
    return _.transform(source, (result, value, key) => {
        const match = this.match(key);

        if( !match ) {
            result[key] = value;
            return;
        }

        const newKey = match[this._key];
        const index = match[this._index];

        if( !result[newKey] )
            result[newKey] = {};

        result[newKey][index] = value;
    }, {});
};

GroupTransformer.prototype.reverse = function(source) {
    return _.transform(source, (result, value, key) => {
        if( !_.isPlainObject(value) ) {
            result[key] = value;
            return;
        }

        _.each(value, (v, idx) => {
            result[key + idx] = v;
        });
    });
};

module.exports = GroupTransformer;
