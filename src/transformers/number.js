'use strict';

const has = require('lodash/has');
const isString = require('lodash/isString');

function detectDecimalSeparator(number) {
    const dots = (number.match(/\./g) || []).length;
    const commas = (number.match(/,/g) || []).length;

    // this number is invalid
    if (dots > 1 && commas > 1)
        return null;

    // many dots, comma is the decimal separator
    if (dots > 1)
        return ',';

    // many commas, dot is the decimal separator
    if (commas > 1)
        return '.';

    // one of both, the last one is the decimal separator
    if (dots && commas)
        return number.indexOf(',') > number.indexOf('.') ? ',' : '.';

    // there is only one, let's use it as decimal separator
    return commas ? ',' : '.';
}

function normalizer(number, decimalSeparator) {
    if (!isString(number))
        return number;

    // autodetect separator
    if (decimalSeparator !== '.' && decimalSeparator !== ',')
        decimalSeparator = detectDecimalSeparator(number);

    if (decimalSeparator !== '.' && decimalSeparator !== ',')
        return NaN;

    if (decimalSeparator === '.') {
        // strip all commas
        return number.replace(/,/g, '');
    }

    // strip all dots and replace comma with dot
    return number.replace(/\./g, '').replace(',', '.');
}

function NumberTransformer(options = {}) {
    if( !(this instanceof NumberTransformer) ) {
        return this.transform(new NumberTransformer(options));
    }

    this._decimalSeparator = options.decimalSeparator || undefined;
    this._NaNValue = has(options, 'NaNValue') ? options.NaNValue : 0;
    this._normalizer = options.normalizer || normalizer;
    this._base = options.base || 10;
}

NumberTransformer.prototype.parse = function(value) {
    value = this._normalizer(value, this._decimalSeparator);

    const isNumber = (typeof value === 'number');

    if (!isNumber && this._base !== 10)
        value = parseInt(value, this._base);
    else if(!isNumber)
        value = parseFloat(value);

    if (isNaN(value))
        return this._NaNValue;

    return value;
};

NumberTransformer.prototype.reverse = function(value) {
    const isNumber = (typeof value === 'number');

    if (isNumber && this._base !== 10)
        value = value.toString(this._base);

    return value;
};

module.exports = NumberTransformer;
