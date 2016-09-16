const _isPlainObject = require('lodash/isPlainObject');
const _transform = require('lodash/transform');
const _merge = require('lodash/merge');

function SpecTransformer(spec) {
    if( !(this instanceof SpecTransformer) ) {
        return this.transform(new SpecTransformer(spec));
    }

    this._spec = spec;
}

SpecTransformer.prototype.parse = function(source) {
    return this._toSpec(this._spec, source);
};

SpecTransformer.prototype._toSpec = function(spec, data) {
    return _transform(spec, (r, v, k) => {
        if (_isPlainObject(v))
            r[k] = this._toSpec(v, data);
        else
            r[k] = v.parse(data);
    }, {});
};

SpecTransformer.prototype.reverse = function(source) {
    return this._fromSpec(this._spec, source);
};

SpecTransformer.prototype._fromSpec = function(spec, data) {
    return _transform(spec, (r, v) => {
        if (_isPlainObject(v))
            _merge(r, this._fromSpec(v, data));
        else
            _merge(r, v.reverse(data));
    }, {});
};

module.exports = SpecTransformer;
