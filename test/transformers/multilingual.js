const assert = require('assert');

describe('multilingual', function() {
    let Multilingual = null;

    before(function() {
        Multilingual = require('src/transformers/multilingual');
    })

    describe('#constructor', function() {
        it('Should parse flat multilingual keys into objects', function() {
            const multilingual = function() {};
            const map = function() { return multilingual; };
            const group = function(regex, m1, m2) {
                assert.equal(regex.toString(), '/(.+)(En|Nl)$/');
                return { map: map };
            };
            const match = function(regex) {
                assert.equal(regex.toString(), '/(.+)(En|Nl)$/');
                return { group: group };
            };

            const obj = {
                multilingual: Multilingual,
                match: match
            };
            const instance = obj.multilingual(['en', 'nl'], Multilingual.CAMEL_CASE);

            assert.equal(instance, multilingual);
        })

        it('Should read languages from options', function() {
            const multilingual = function() {};
            const map = function() { return multilingual; };
            const group = function(regex, m1, m2) {
                assert.equal(regex.toString(), '/(.+)(En|Nl|Fr)$/');
                return { map: map };
            };
            const match = function(regex) {
                assert.equal(regex.toString(), '/(.+)(En|Nl|Fr)$/');
                return { group: group };
            };

            const obj = {
                multilingual: Multilingual,
                match: match,
                getOption: function(key) {
                    if (key == 'multilingual.languages')
                        return ['en', 'nl', 'fr'];
                }
            };
            const instance = obj.multilingual();

            assert.equal(instance, multilingual);
        })

        it('Should ignore languages if not set', function() {
            const multilingual = function() {};
            const map = function() { return multilingual; };
            const group = function(regex, m1, m2) {
                assert.equal(regex.toString(), '/(.+)()$/');
                return { map: map };
            };
            const match = function(regex) {
                assert.equal(regex.toString(), '/(.+)()$/');
                return { group: group };
            };

            const obj = {
                multilingual: Multilingual,
                match: match,
                getOption: function() { }
            };
            const instance = obj.multilingual();

            assert.equal(instance, multilingual);
        })

        it('Should ignore languages if not set', function() {
            const multilingual = function() {};
            const map = function() { return multilingual; };
            const group = function(regex, m1, m2) {
                assert.equal(regex.toString(), '/(.+)()$/');
                return { map: map };
            };
            const match = function(regex) {
                assert.equal(regex.toString(), '/(.+)()$/');
                return { group: group };
            };

            const obj = {
                multilingual: Multilingual,
                match: match,
                getOption: function() { }
            };
            const instance = obj.multilingual();

            assert.equal(instance, multilingual);
        })

        it('Should call rename for map', function() {
            const multilingual = function() {};
            const renamer = function(toLowerCase, toPascalCase) {
                assert.equal(typeof toLowerCase, 'function');
                assert.equal(typeof toPascalCase, 'function');

                assert.equal(toLowerCase('AbC'), 'abc');
                assert.equal(toPascalCase('abC'), 'AbC');
            }
            const map = function(f) {
                assert.equal(typeof f, 'function');
                f({ rename: renamer });

                return multilingual;
            };
            const group = function(regex, m1, m2) {
                assert.equal(regex.toString(), '/(.+)()$/');
                return { map: map };
            };
            const match = function(regex) {
                assert.equal(regex.toString(), '/(.+)()$/');
                return { group: group };
            };

            const obj = {
                multilingual: Multilingual,
                match: match,
                getOption: function() { }
            };
            const instance = obj.multilingual();

            assert.equal(instance, multilingual);
        })

        it('Should support snake case', function () {
            const multilingual = function() {};
            const renamer = function(restorer, suffixer) {
                assert.equal(typeof restorer, 'function');
                assert.equal(typeof suffixer, 'function');

                assert.equal(restorer('_abc'), 'abc');
                assert.equal(suffixer('abc'), '_abc');
            }
            const map = function(f) {
                assert.equal(typeof f, 'function');
                f({ rename: renamer });

                return multilingual;
            };
            const group = function(regex, m1, m2) {
                assert.equal(regex.toString(), '/(.+)(_en|_fr)$/');
                return { map: map };
            };
            const match = function(regex) {
                assert.equal(regex.toString(), '/(.+)(_en|_fr)$/');
                return { group: group };
            };

            const obj = {
                multilingual: Multilingual,
                match: match,
                getOption: function() { }
            };
            const instance = obj.multilingual([ 'en', 'fr' ], Multilingual.SNAKE_CASE);

            assert.equal(instance, multilingual);
        })
    })
});
