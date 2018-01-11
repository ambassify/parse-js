const assert = require('assert');

describe('Parse', function() {
    let Parse = null;
    const noop = function () {};

    before(function() {
        Parse = require('src/index');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword', function() {
            const instance = Parse('test');

            assert.ok(instance instanceof Parse);
        })

        it('Should set options', function() {
            const options = {
                option: 'one'
            };

            const instance = new Parse('test', options);

            assert.equal(instance._options, options);
            assert.equal(instance.getOption('option'), 'one');
        })

        it('Should not add select transformer when no path is set', function() {
            const instance = new Parse();

            assert.deepEqual(instance._chain, []);
        })
    })

    describe('#register', function() {
        it('Should register transformers on the prototype', function() {
            const handler = function() {};
            Parse.register('test', handler);

            assert.equal(Parse.prototype.test, handler);
        })

        it('Should throw error when re-registering handler', function() {
            assert.throws(function() {
                const handler = function() {};
                Parse.register('test', handler);
            });
        })

        it('Should overwrite when the options is set', function() {
            const handler = function() {};
            Parse.register('test', handler, { overwrite: true });
        })
    })

    describe('#setOption/getOption', function() {
        it('Should set option', function() {
            Parse.setOption('test1', '12345');
        })

        it('Should fetch options', function() {
            assert.equal(Parse.getOption('test1'), '12345');
        })
    })

    describe('#setOption', function() {
        it('Should set option on instance', function() {
            const instance = new Parse('test');
            instance.setOption('test2', '54321');

            assert.deepEqual(instance._options, {
                test2: '54321'
            });
        })
    })

    describe('#getOption', function() {
        it('Should get option of instance', function() {
            const instance = new Parse('test');
            instance.setOption('test3', '54321');

            assert.deepEqual(instance._options, {
                test3: '54321'
            });
        })

        it('Should fall through to global settings', function() {
            Parse.setOption('test4', '0000');

            const instance = new Parse('test');
            const result = instance.getOption('test4');
            console.log(instance.constructor.toString());
            console.log(Parse.toString());
            console.log(instance.constructor.options);

            assert.equal(result, '0000');
        })
    })

    describe('#transform', function() {
        it('Should accept object', function() {
            const parser = {
                parser: noop,
                reverser: noop
            };

            const instance = new Parse('test');
            instance.transform(parser);

            assert.equal(instance._chain[1], parser);
        })

        it('Should accept parser and reverser functions', function() {
            const parser = function() {};
            const reverser = function() {};

            const instance = new Parse('test');
            instance.transform(parser, reverser);

            assert.deepEqual(instance._chain[1], {
                parse: parser,
                reverse: reverser
            });
        })
    })

    describe('#parse', function() {
        it('Should call the transform chain', function() {
            const instance = new Parse('test');
            const called = [];
            instance._chain = [{
                parse: function() { called.push('parse-1'); },
                reverse: noop
            }];

            instance.parse({});

            assert.deepEqual(called, ['parse-1']);
        })

        it('Should call the transform chain', function() {
            const instance = new Parse('test');
            const called = [];
            instance._chain = [{
                parse: function() { called.push('parse-1'); },
                reverse: noop
            },{
                parse: function() { called.push('parse-2'); },
                reverse: noop
            }];

            instance.parse({});

            assert.deepEqual(called, ['parse-1','parse-2']);
        })

        it('Should return original when parse is disabled', function() {
            const instance = new Parse('test');
            instance.setOption('direction', Parse.DIRECTION_REVERSE);

            const obj = {
                test: 'abc'
            };

            instance.parse(obj);

            assert.equal(instance.parse(obj), obj);
        })

        it('Should parse when reverse is disabled', function() {
            const instance = new Parse('test');
            instance.setOption('direction', Parse.DIRECTION_PARSE);

            const obj = {
                test: 'abc'
            };

            instance.parse(obj);

            assert.equal(instance.parse(obj), 'abc');
        })
    })

    describe('#reverse', function() {
        it('Should call the transform chain in reverse', function() {
            const instance = new Parse('test');
            const called = [];
            instance._chain = [{
                parse: noop,
                reverse: function() { called.push('reverse-1'); }
            }];

            instance.reverse({});

            assert.deepEqual(called, ['reverse-1']);
        })

        it('Should call the transform chain in reverse', function() {
            const instance = new Parse('test');
            const called = [];
            instance._chain = [{
                parse: noop,
                reverse: function() { called.push('reverse-1'); }
            },{
                parse: noop,
                reverse: function() { called.push('reverse-2'); }
            }];

            instance.reverse({});

            assert.deepEqual(called, ['reverse-2','reverse-1']);
        })

        it('Should return original when reverse is disabled', function() {
            const instance = new Parse('test');
            instance.setOption('direction', Parse.DIRECTION_PARSE);

            const obj = {
                test: 'abc'
            };

            assert.equal(instance.reverse(obj), obj);
        })

        it('Should reverse when parse is disabled', function() {
            const instance = new Parse('test');
            instance.setOption('direction', Parse.DIRECTION_REVERSE);

            const obj = {
                test: 'abc'
            };

            assert.deepEqual(instance.reverse('abc'), obj);
        })
    })

    describe('#chain', function() {
        it('Should call the configurator with correct arguments', function() {
            const instance = new Parse();

            const result = instance.chain(function(p) {
                assert.equal(p, instance);
            });

            assert.equal(result, instance);
        })

        it('Should return the result of configurator', function() {
            const instance = new Parse();

            const result = instance.chain(function(p) {
                assert.equal(p, instance);

                return new Parse();
            });

            assert.notEqual(result, instance);
        })
    })
});
