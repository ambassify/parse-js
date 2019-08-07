module.exports = function _transform(obj, fn, acc = {}) {
    if (!obj)
        return acc;

    const keys = Object.keys(obj);
    const len = keys.length;

    for (let i = 0; i < len; i++)
        fn(acc, obj[keys[i]], keys[i]);

    return acc;
};
