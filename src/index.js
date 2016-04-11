const parse = require('./lib/parse');

const test = parse('test').multilingual();

console.log('parse', test.parse({
    test: {
        'laNl': true,
        'laFr': true,
        'bla': 'tv'
    }
}))

console.log('reverse', test.reverse({
    la: {
        nl: true,
        fr: true
    }
}));
