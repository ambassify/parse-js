const parse = require('./parse');

const test = parse('test').multilingual();

parse.setOption('multilingual.languages', ['en', 'nl', 'fr']);

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
