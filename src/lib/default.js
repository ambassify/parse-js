function isDefaultEnabled(parse) {
    return parse.getOption('allow-default') !== false;
}

function getDefault(parse, defaultValue, currentValue) {
    if (!isDefaultEnabled(parse))
        return currentValue;

    if (typeof defaultValue === 'undefined')
        return currentValue;

    return defaultValue;
}

module.exports = {
    isDefaultEnabled,
    getDefault
};
