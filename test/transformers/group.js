const assert = require('assert');

describe('group', function() {
    let Group = null;

    before(function() {
        Group = require('src/transformers/group');
    })

    describe('#constructor', function() {
        it('Should create an instance without new keyword when attached', function() {
            const regex = /test/;
            const obj = {
                group: Group,
                transform: instance => {
                    assert(instance instanceof Group);
                    assert.equal(instance._regex, regex);
                    assert.equal(instance._key, 1);
                    assert.equal(instance._index, 2);
                }
            };

            obj.group(regex, 1, 2);
        })
    })

    describe('#parse', function() {
        it('Should group 1 prefix based on regex', function() {
            const instance = new Group(/^(prefix)(suf|fix)$/, 1, 2);
            const result = instance.parse({
                prefixsuf: 'test1',
                prefixfix: 'test2'
            });

            assert.deepEqual(result, {
                prefix: { suf: 'test1', fix: 'test2' }
            });
        })

        it('Should group multiple prefixes based on regex', function() {
            const instance = new Group(/^(prefix|test)(suf|fix)$/, 1, 2);
            const result = instance.parse({
                prefixsuf: 'test1',
                prefixfix: 'test2',
                testsuf: 'test3'
            });

            assert.deepEqual(result, {
                prefix: { suf: 'test1', fix: 'test2' },
                test: { suf: 'test3' }
            });
        })

        it('Should leave value intact when regex does not match', function() {
            const instance = new Group(/^(prefix|test)(suf|fix)$/, 1, 2);
            const result = instance.parse({
                prefixsuf: 'test1',
                prefixfix: 'test2',
                testsuf: 'test3',
                not: 'matching'
            });

            assert.deepEqual(result, {
                prefix: { suf: 'test1', fix: 'test2' },
                test: { suf: 'test3' },
                not: 'matching'
            });
        })
    })

    describe('#reverse', function() {
        it('Should reverse a single group', function() {
            const instance = new Group(/^(prefix)(suf|fix)$/, 1, 2);
            const result = instance.reverse({
                prefix: { suf: 'test1', fix: 'test2' }
            });

            assert.deepEqual(result, {
                prefixsuf: 'test1',
                prefixfix: 'test2'
            });
        })

        it('Should reverse multiple groups', function() {
            const instance = new Group(/^(prefix)(suf|fix)$/, 1, 2);
            const result = instance.reverse({
                prefix: { suf: 'test1', fix: 'test2' },
                test: { suf: 'test3' }
            });

            assert.deepEqual(result, {
                prefixsuf: 'test1',
                prefixfix: 'test2',
                testsuf: 'test3'
            });
        })

        it('Should leave value intact when regex does not match', function() {
            const instance = new Group(/^(prefix)(suf|fix)$/, 1, 2);
            const result = instance.reverse({
                prefix: { suf: 'test1', fix: 'test2' },
                test: { suf: 'test3' },
                not: 'matching'
            });

            assert.deepEqual(result, {
                prefixsuf: 'test1',
                prefixfix: 'test2',
                testsuf: 'test3',
                not: 'matching'
            });
        })
    })
});
