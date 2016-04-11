'use strict';

var _ = require('lodash');
var assert = require('assert');
var parse = require('index');
var Base64 = require('js-base64').Base64;

describe('parse.js', function() {

    describe('#parse.boolean', function() {
        it('Should convert any input to boolean', function() {
            var subject = {
                shouldBeTrue: {
                    a: true,
                    b: 'true',
                    c: 1,
                    d: '1',
                    e: 'yes',
                    f: {},
                    g: [],
                    h: -1,
                    i: -22,
                    j: function() {}
                },
                shouldBeFalse: {
                    a: false,
                    b: 'false',
                    c: 'no',
                    d: 'nope',
                    e: 0,
                    f: '0',
                    g: 'something else',
                    h: null,
                    i: 'null'
                }
            };

            _.each(subject.shouldBeTrue, function(v, k) {
                assert(parse.boolean('shouldBeTrue.' + k)(subject), 'key ' + k + ' with value "' + v + '" should equal true');
            });

            _.each(subject.shouldBeFalse, function(v, k) {
                assert(!parse.boolean('shouldBeFalse.' + k)(subject), 'key ' + k + ' with value "' + v + '" should equal false');
            });

            assert(parse.boolean('key.is.missing', true)(subject), 'Should respect defaultValue for missing key');
            assert(!parse.boolean('key.is.missing', false)(subject), 'Should respect defaultValue for missing key');

            _.each(subject.shouldBeTrue, function(v) {
                if( _.isString(v) ) return;

                assert(parse.boolean(v)(subject), 'value "' + v + '" should equal true');
            });

            _.each(subject.shouldBeFalse, function(v) {
                if( _.isString(v) ) return;

                assert(!parse.boolean(v)(subject), 'value "' + v + '" should equal false');
            });

        });
    });

    describe('#parse.array', function() {
        it('Should convert lists to arrays', function() {
            assert.deepEqual(parse.array('test')({
                test: '["a"],b,c,d,e,f'
            }), ['["a"]','b','c','d','e','f']);
        });

        it('Should convert single values to an array with a single value', function() {
            assert.deepEqual(parse.array('test')({
                test: 'abcdef'
            }), ['abcdef']);
        });

        it('Should apply valueParser to each value in the list', function() {
            var valueParser = function(x) { return x.toUpperCase(); };
            assert.deepEqual(parse.array('test', valueParser)({
                test: 'a,b,c,d,e,f'
            }), ['A','B','C','D','E','F']);
        });

        it('Should convert empty values to an empty array', function() {
            var subject = {
                a: '',
                b: null,
                c: false
            };

            _.each(subject, function(v, k) {
                assert.deepEqual(parse.array(k)(subject), [],
                    'key ' + k + ' with value "' + v + '" should equal an empty array');
            });
        });

        it('Should convert invalid json to empty array', function() {
            var subject = {
                a: '{}',
                b: 'true',
                c: '123'
            };

            _.each(subject, function(v, k) {
                assert.deepEqual(parse.array(k)(subject), [],
                    'key ' + k + ' with value "' + v + '" should equal an empty array');
            });
        });

        it('Should reverse arrays to json', function() {
            var parser = parse.array('a');
            var array = ['test', '123'];
            var target = {
                a: JSON.stringify(array)
            };

            assert.deepEqual(parser.reverse(array), target, 'Should reverse to correct JSON');
        });
    });

    describe('#parse.matchKey', function() {
        var subject = {
            test: {
                'a_one': true,
                'a_two': 1,
                'b_three': false,
                'b_four': 'this is a test'
            }
        };

        it('Should select correct keys based on string selector', function() {
            assert.deepEqual(parse.matchKey('test', 'a_')(subject), {
                'a_one': true,
                'a_two': 1
            }, 'Should have selected keys which contain "a_"');

            assert.deepEqual(parse.matchKey('test', '_t')(subject), {
                'a_two': 1,
                'b_three': false
            }, 'Should have selected keys which contain "_t"');
        });

        it('Should select correct keys based on regex selector', function() {
            assert.deepEqual(parse.matchKey('test', /^a_/)(subject), {
                'a_one': true,
                'a_two': 1
            }, 'Should have selected keys prefixed with "a_"');

            assert.deepEqual(parse.matchKey('test', /e$/)(subject), {
                'a_one': true,
                'b_three': false
            }, 'Should have selected keys ending with an "e"');
        });
    });

    describe('#parse.matchPrefixStrip', function() {
        var subject = {
            test: {
                'a_one': true,
                'a_two': 1,
                'b_three': false,
                'b_four': 'this is a test'
            }
        };

        it('Should select correct keys based on string selector', function() {
            assert.deepEqual(parse.matchPrefixStrip('test', 'a_')(subject), {
                'one': true,
                'two': 1
            }, 'Should have selected keys which start with "a_"');

            assert.deepEqual(parse.matchPrefixStrip('test', '_t')(subject),
                {}, 'Should have selected no keys.');
        });

        it('Should reverse to the correct structure', function() {
            var parser = parse.matchPrefixStrip('test', 'a');
            assert.deepEqual(parser.reverse({
                'one': true,
                'two': 1
            }), {
                'test': {
                    'aOne': true,
                    'aTwo': 1
                }
            }, 'Should have reversed to the correct structure, where keys are prefixed with "a".');
        });
    });

    describe('#parse.string', function() {
        var subject = {
            a: 'one',
            b: '123',
            c: 1234,
            d: true,
            e: false,
            f: undefined,
            g: null
        };

        var results = {
            a: 'one',
            b: '123',
            c: '1234',
            d: 'true',
            e: 'false',
            f: '',
            g: ''
        };

        it('Should convert all values to strings', function() {
            _.each(subject, function(v, k) {
                assert.equal(parse.string(k)(subject), results[k],
                    'key ' + k + ' with value "' + v + '" should be a string and equal "' + results[k] + '" but was "' + parse.string(k)(subject) + '"');
            });
        });
    });

    describe('#parse.multilingual', function() {
        var subject = {
            keyNl: 'een test',
            keyFr: 'une test',
            keyEn: 'a test',

            test: {
                vNl: 'een test',
                vFr: 'une test',
                vEn: 'a test'
            }
        };

        var valueParser = function(x) {
            if( _.isString(x) )
                return x.toUpperCase();
        };

        it('Should read an array for multilingual fields', function() {
            assert.deepEqual(parse.multilingual('key')(subject), {
                nl: 'een test',
                fr: 'une test',
                en: 'a test'
            }, 'Language values should be compacted into an array');
        });

        it('Should read an array for multilingual fields using an underscore', function() {
            assert.deepEqual(parse.multilingual('key', x => x, false, 'underscore')({
                key_nl: 'een test',
                key_fr: 'une test',
                key_en: 'a test'
            }), {
                nl: 'een test',
                fr: 'une test',
                en: 'a test'
            }, 'Language values should be compacted into an array');
        });

        it('Should be able to parse multilingual values', function() {
            assert.deepEqual(parse.multilingual('key', valueParser)(subject), {
                nl: 'EEN TEST',
                fr: 'UNE TEST',
                en: 'A TEST'
            }, 'Language values should be compacted into an array');
        });

        it('Should be able to group multilingual values', function() {
            assert.deepEqual(parse.multilingual('', (x=>x), true)(subject), {
                key: {
                    nl: 'een test',
                    fr: 'une test',
                    en: 'a test'
                },
                test: {
                    vNl: 'een test',
                    vFr: 'une test',
                    vEn: 'a test'
                }
            }, 'Language values should be group together under their key');
        });

        it('Should be able to group multilingual values one level deep', function() {
            assert.deepEqual(parse.multilingual('test', (x=>x), true)(subject), {
                v: {
                    nl: 'een test',
                    fr: 'une test',
                    en: 'a test'
                }
            }, 'Language values should be group together under their key');
        });

        it('Should be able to reverse multilingual properties', function() {
            var parser = parse.multilingual('key');
            var data = {
                nl: 'een test',
                fr: 'une test',
                en: 'a test'
            };

            assert.deepEqual(parser.reverse(data),
                _.pick(subject, 'keyEn', 'keyNl', 'keyFr'),
                'Reverse should match subject');
        });


        it('Should be able to reverse multilingual properties with underscores', function() {
            var parser = parse.multilingual('key', x => x, false, 'underscore');
            var data = {
                nl: 'een test',
                fr: 'une test',
                en: 'a test'
            };

            assert.deepEqual(parser.reverse(data), {
                key_nl: 'een test',
                key_fr: 'une test',
                key_en: 'a test'
            }, 'Reverse should match subject');
        });

        it('Should be able to reverse nested multilingual properties', function() {
            var parser = parse.multilingual('test.deep');
            var data = {
                nl: 'een test',
                pl: 'a test'
            };

            assert.deepEqual(parser.reverse(data), {
                test: {
                    deepNl: 'een test',
                    deepPl: 'a test'
                }
            }, 'Reverse should have correct keys.');
        });
    });

    describe('#parse.date', function() {
        it('Should parse dates correctly', function() {
            var date = new Date('February 3, 1998').toString();

            var subject = {
                test: 'February 3, 1998'
            };

            var parser = parse.date('test');
            assert.equal(parser(subject).toString(), date, 'Should parse date correctly');
        });

        it('Should reverse dates correctly', function() {
            var date = new Date('June 10, 2003');
            var target = {
                test: date.toJSON()
            };

            var parser = parse.date('test');
            assert.deepEqual(parser.reverse(date), target, 'Should revert date correctly');
        });
    });

    describe('#parse.equals', function() {
        var subject = {
            test: {
                deep: 1256
            }
        };

        it('Should be able to check if the value at a path equals a value', function() {
            var parser = parse.equals('test.deep', 1256);
            assert(parser(subject), 'The value at test.deep should match 1256');

            parser = parse.equals('test.deep', 111);
            assert(!parser(subject), 'The value at test.deep should not match 111');
        });

        it('Should reverse equals values correctly', function() {
            var parser = parse.equals('test.deep', 1256);

            assert.deepEqual(parser.reverse(true), subject, 'Reverted object should equal subject');
            assert.deepEqual(parser.reverse(false), {}, 'Nothing should be set when not equal');
        });

        it('Should reverse equals value to desired value', function() {
            var parser = parse.equals('test.deep', 1256, 2000);

            assert.deepEqual(parser.reverse(true), subject, 'Reverted object should equal subject');
            assert.deepEqual(parser.reverse(false), {
                test: {
                    deep: 2000
                }
            }, 'Nothing should be set when not equal');
        });
    });

    describe('#nested', function() {
        var html = `<p>Dit is een test abc</p>
<p>Wat is er aan de hand</p>
<p>test test test</p>
<p>jajajajaj</p>
<p>cacacaca</p>
<p>tatata</p>
<p>ddddd</p>
<figure>
<div class="figure__image"><img src="https://s3-eu-central-1.amazonaws.com/tmp.ambassify.eu/10782018-239c-4b57-a46b-25af8f53eeec.jpg" alt="lalla" />
<figcaption>lalla</figcaption>
</div>
</figure>
<figure class="inline-left" contenteditable="false">
<div class="figure__image"><img src="https://s3-eu-central-1.amazonaws.com/tmp.ambassify.eu/200c25a7-efda-4e44-84d5-a69335acb6ba.jpg" alt="&nbsp;sfasdfsdf" />
<figcaption>&nbsp;sfasdfsdf</figcaption>
</div>
</figure>
<p>&nbsp;asdfadsf</p>
<p>asdf</p>
<p>ads</p>
<p>fads</p>
<p>f</p>
<p>asd</p>
<p>fads</p>
<p>f</p>
<p>asdf</p>
<p>asd</p>
<p>fa</p>
<p>sdf</p>
<p>ads</p>
<p>fa</p>
<p>sdf</p>
<p>ds</p>
<p>f</p>`,
            subject = {
                test: {
                    'a_oneNl': true,
                    'a_oneEn': false,
                    'a_two': 1,
                    'b_three': false,
                    'b_four': 'this is a test'
                },
                test2: {
                    settingAnswersNl: '["a","b"]'
                },
                test3: {
                    settingAnswers: 'WyJhIiwiYiJd' // '["a","b"]'
                },
                test4: {
                    settingAnswersNl: 'bG9yZW0gaXBzdW0gPGlmcmFtZT5odG1sIGNvZGU8L2lmcmFtZT4=' // lorem ipsum <iframe>html code</iframe>
                },
                test5: {
                    settingAnswers: 'abcde'
                },
                test6: {
                    settingAnswers: Base64.encode(html)
                },
                test7: {
                    fooNl: JSON.stringify({ winning: '9999', times: '!' }),
                    fooEn: JSON.stringify({ winning: '1111', times: '!' })
                }
            };

        it('Should select correct keys based on string selector', function() {
            var parser = parse.multilingual(parse.matchPrefixStrip('test', 'a_', false), undefined, true);
            var target = {
                'one': { nl: true, en: false },
                'two': 1
            };

            assert.deepEqual(parser(subject), target,
                'Should have selected keys which start with "a_" and converted multilingual keys');
        });

        it('Should revert to the correct object', function() {
            var parser = parse.multilingual(parse.matchPrefixStrip('test', 'a_', false), undefined, true);
            var target = {
                'one': { nl: true, en: false },
                'three': { en: false },
                'two': 1
            };

            assert.deepEqual(parser.reverse(target), {
                test: {
                    'a_oneNl': true,
                    'a_oneEn': false,
                    'a_threeEn': false,
                    'a_two': 1
                }
            }, 'Should have the correct reverted structure');
        });

        it('Should revert to the correct object', function() {
            var parser = parse.boolean(parse.matchPrefixStrip('test', 'a_', false));
            var target = {
                'one': 'true',
                'two': 'false',
                'three': 'true'
            };

            assert.deepEqual(parser.reverse(target), {
                test: {
                    'a_one': true,
                    'a_two': false,
                    'a_three': true
                }
            }, 'Should have the correct reverted structure');
        });

        it('Should parse arrays in multilingual fields', function() {
            var parser = parse.array(parse.multilingual('test2.settingAnswers'));
            var target = {
                nl: ['a', 'b']
            };

            assert.deepEqual(parser(subject), target, 'Should parse arrays in multilingual fields');
        });

        it('Should reverse arrays in multilinual fields', function() {
            var parser = parse.array(parse.multilingual('test2.settingAnswers'));
            var target = {
                test2: {
                    settingAnswersNl: '["a","b"]'
                }
            };

            assert.deepEqual(parser.reverse({ nl: ['a','b'] }), target, 'Should reverse arrays in multilingual fields');
        });

        it('Should parse base64 encoded arrays', function() {
            var parser = parse.array(parse.base64('test3.settingAnswers'));
            var target = ['a', 'b'];

            assert.deepEqual(parser(subject), target, 'Should parse base64 encoded arrays');
        });

        it('Should not parse invalid base64', function() {
            var parser = parse.base64('test5.settingAnswers');
            var target = 'abcde';

            assert.deepEqual(parser(subject), target, 'Should not parse invalid base64');
        });

        it('Should parse base64 html', function() {
            var parser = parse.base64('test6.settingAnswers');
            assert.equal(parser(subject), html, 'Should not parse invalid base64');
        });

        it('Should reverse base64 encoded arrays', function() {
            var parser = parse.array(parse.base64('test3.settingAnswers'));
            var target = {
                test3: {
                    settingAnswers: 'WyJhIiwiYiJd'
                }
            };

            assert.deepEqual(parser.reverse(['a','b']), target, 'Should reverse base64 encoded arrays');
        });

        it('Should parse base64 in multilingual fields', function() {
            var parser = parse.base64(parse.multilingual('test4.settingAnswers'));
            var target = {
                nl: 'lorem ipsum <iframe>html code</iframe>'
            };

            assert.deepEqual(parser(subject), target, 'Should parse base64 in multilingual fields');
        });

        it('Should reverse base64 in multilinual fields', function() {
            var parser = parse.base64(parse.multilingual('test4.settingAnswers'));
            var target = {
                test4: {
                    settingAnswersNl: 'bG9yZW0gaXBzdW0gPGlmcmFtZT5odG1sIGNvZGU8L2lmcmFtZT4='
                }
            };

            assert.deepEqual(parser.reverse({ nl: 'lorem ipsum <iframe>html code</iframe>' }), target, 'Should reverse base64 in multilingual fields');
        });

        it('Should parse json in multilingual fields', function() {
            var parser = parse.json(parse.multilingual('test7.foo'));
            var target = {
                nl: { winning: '9999', times: '!' },
                en: { winning: '1111', times: '!' }
            };

            assert.deepEqual(parser(subject), target, 'Should parse json in multilingual fields');
        });

        it('Should reverse json in multilinual fields', function() {
            var parser = parse.json(parse.multilingual('test7.foo'));
            var target = {
                nl: { winning: '9999', times: '!' },
                en: { winning: '1111', times: '!' }
            };

            assert.deepEqual(parser.reverse(target), _.pick(subject, 'test7'), 'Should reverse base64 in multilingual fields');
        });
    });

    describe('#parse.number', function() {
        const NaN_VALUE = 'nanval';

        const subject = {
            a: 'one',
            b: '123',
            c: '123,345',
            d: '123.345',
            f: '-123.345',
            g: '-0',
            h: 1234,
            i: true,
            j: false,
            k: undefined,
            l: null
        };

        const results = {
            a: NaN_VALUE,
            b: 123,
            c: 123.345,
            d: 123.345,
            f: -123.345,
            g: 0,
            h: 1234,
            i: NaN_VALUE,
            j: NaN_VALUE,
            k: NaN_VALUE,
            l: NaN_VALUE
        };

        const reverseResults = {
            a: NaN_VALUE,
            b: 123,
            c: 123.345,
            d: 123.345,
            f: -123.345,
            g: 0,
            h: 1234,
            i: NaN_VALUE,
            j: NaN_VALUE,
            k: NaN_VALUE,
            l: NaN_VALUE
        };

        it('Should convert all values to numbers', function() {
            _.each(subject, function(v, k) {
                assert.equal(parse.number(k, NaN_VALUE)(subject), results[k],
                    'key ' + k + ' with value "' + v + '" should be a number and equal "' + results[k] + '" but was "' + parse.number(k, NaN_VALUE)(subject) + '"');
            });
        });

        it('Should reverse numbers taking NaN values into account', function() {
            _.each(results, function(v, k) {
                const reversed = parse.number(k, NaN_VALUE).reverse(v)[k];
                assert.equal(reversed, reverseResults[k],
                    'key ' + k + ' with value "' + v + '" should be reversed to "' + reverseResults[k] + '" but was "' + reversed + '"');
            });
        });
    });

    describe('#parse.base64', function() {
        const subject = {
            a: 'bG9yZW0gaXBzdW0gPGlmcmFtZT5odG1sIGNvZGU8L2lmcmFtZT4=',
            b: Base64.encode('é')
        };

        const result = {
            a: 'lorem ipsum <iframe>html code</iframe>',
            b: 'é'
        };

        it('Should parse base64', function() {
            var parser = parse.base64('a');
            assert.deepEqual(parser(subject), result.a, 'Should parse base64');
        });

        it('Should convert to base64', function() {
            var parser = parse.base64('a');
            assert.deepEqual(parser.reverse(result.a), _.pick(subject, 'a'), 'Should convert to base64');
        });

        it('Should parse base64 with foreign characters', function() {
            var parser = parse.base64('b');
            assert.deepEqual(parser(subject), result.b, 'Should parse base64 with foreign characters');
        });
    });

    describe('#parse.json', function() {
        const result = {
            a: { all: 'the', things: 999 }
        };

        const subject = {
            a: JSON.stringify(result.a)
        };

        it('Should parse json', function() {
            var parser = parse.json('a');
            assert.deepEqual(parser(subject), result.a, 'Should parse json');
        });

        it('Should convert to json', function() {
            var parser = parse.json('a');
            assert.deepEqual(parser.reverse(result.a), subject, 'Should convert to json');
        });
    });

});
