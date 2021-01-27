'use strict';

const _get = require('lodash/get');
const _isNil = require('lodash/isNil');
const _isFunction = require('lodash/isFunction');

const nullSelector = {
    parse: function() {},
    reverse: function() {}
};

function wrapPath(selector) {
    if (_isFunction(selector))
        return selector;

    if (_isNil(selector))
        return selector;

    return (source) => _get(source, selector);
}

function SwitchTransformer(cases = {}, parseSelector, reverseSelector) {
    if( !(this instanceof SwitchTransformer) ) {
        return this.transform(new SwitchTransformer(cases, parseSelector, reverseSelector));
    }

    this._cases = cases;
    this._parseSelector = wrapPath(parseSelector);
    this._reverseSelector = wrapPath(reverseSelector);
}

SwitchTransformer.prototype._getParser = function(source, root, selector) {
    if (!selector)
        return nullSelector;

    const value = selector(source, root);
    const next = this._cases[value];

    if (next)
        return next;

    return this._cases['_default_'];
};

SwitchTransformer.prototype.parse = function(source, instance, root) {
    const next = this._getParser(source, root, this._parseSelector);

    if (!next || !_isFunction(next.parse))
        return (void 0);

    return next.parse(source, instance, root);
};

SwitchTransformer.prototype.reverse = function(source, instance, root) {
    const next = this._getParser(source, root, this._reverseSelector);

    if (!next || !_isFunction(next.reverse))
        return (void 0);

    return next.reverse(source, instance, root);
};

module.exports = SwitchTransformer;
