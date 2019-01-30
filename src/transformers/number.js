const isString = require('lodash/isString');

function normalizer(number, decimalSeparator) {
    if (!isString(number))
        return number;

    // autodetect separator
    if (decimalSeparator !== '.' && decimalSeparator !== ',') {
        const dots = (number.match(/\./g) || []).length;
        const commas = (number.match(/,/g) || []).length;

        // this number is invalid
        if (dots > 1 && commas > 1)
            return NaN;

        // many dots, comma is the decimal separator
        if (dots > 1)
            decimalSeparator = ',';
        // many commas, dot is the decimal separator
        else if (commas > 1)
            decimalSeparator = '.';
        // one of both, the last one is the decimal separator
        else if (dots && commas)
            decimalSeparator = number.indexOf(',') > number.indexOf('.') ? ',' : '.';
        // there is only one, let's use it as decimal separator
        else
            decimalSeparator = commas ? ',' : '.';
    }

    if (decimalSeparator === '.') {
        // strip all commas
        number = number.replace(/,/g, '');
    } else if (decimalSeparator === ',') {
        // strip all dots and replace comma with dot
        number = number.replace(/\./g, '').replace(',', '.');
    }

    return number;
}

function NumberTransformer(options = {}) {
    if( !(this instanceof NumberTransformer) ) {
        return this.transform(new NumberTransformer(options));
    }

    this._decimalSeparator = options.decimalSeparator || undefined;
    this._NaNValue = options.NaNValue || 0;
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
