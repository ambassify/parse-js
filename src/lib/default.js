function isDefaultEnabled(parse) {
    return parse.getOption('allow-default') !== false;
}

function getDefault(parse, defaultValue, currentValue) {
    if (isDefaultEnabled(parse))
        return defaultValue || currentValue;

    return (void 0);
}

module.exports = {
    isDefaultEnabled,
    getDefault
};
