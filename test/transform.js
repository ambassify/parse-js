'use strict';

var assert = require('assert');
var parse = require('index');
var transform = require('transform');

describe('transform.js', function() {

    describe('#reverseTransform', function() {

        it('Should reverse data according to spec', function() {
            var spec = {
                id: 'id',
                meta: 'meta',
                name: parse.string('meta.name'),
                lastSeen: parse.date('lastSeen'),

                settings: parse.matchPrefixStrip('meta', 'setting')
            };

            var lastSeen = new Date();

            var data = {
                id: '1234',
                name: 'John Doe',
                meta: {
                    sources: 'advertisements'
                },
                lastSeen: lastSeen,
                settings: {
                    type: 'test',
                    value: 'abc',
                    enabled: false
                }
            };

            var result = transform.reverseTransform(spec, data);

            assert.deepEqual(result, {
                id: '1234',
                lastSeen: lastSeen.toJSON(),
                meta: {
                    name: 'John Doe',
                    sources: 'advertisements',
                    settingType: 'test',
                    settingValue: 'abc',
                    settingEnabled: false
                }
            }, 'Reverse transform equals expected format.');
        });

        it('Should revert arrays correctly', function() {

            var data = {
                'id': 4818,
                'name': '',
                'title': {},
                'image': {
                    'location': {},
                    'placement': ''

                },
                'summary': {},
                'content': {},
                'link': '',
                'attachments': '',
                'config': {
                    'comments': true,
                    'shareable': false,
                    'shareNetworks': [
                        'Array'
                    ],
                    'fistbump': true,
                    'pinned': false,
                    'languages': [
                        'Array',
                        'nl',
                        'en',
                        'fr'
                    ]
                },
                'challenge': {
                    'type': 'poll',
                    'settings': {}
                }
            };

            var spec = {
                id: 'id',
                name: 'name',
                title: parse.multilingual('meta.title'),
                image: {
                    location: parse.multilingual('meta.image'),
                    placement: 'meta.imagePlacement'
                },
                summary: parse.multilingual('meta.summary', parse.parsers.string),
                content: parse.multilingual('meta.content', parse.parsers.string),
                link: 'meta.link',
                attachments: 'meta.attachments',

                config: {
                    comments: parse.boolean('meta.commentsEnabled'),
                    shareable: parse.boolean('meta.shareEnabled'),
                    shareNetworks: parse.array('meta.shareNetworks'),
                    fistbump: parse.boolean('meta.fistbumpEnabled'),
                    pinned: parse.boolean('meta.pinned'),
                    languages: parse.array('meta.language')
                },

                challenge: {
                    type: 'meta.challengeType',
                    settings: parse.multilingual(parse.matchPrefixStrip('meta', 'setting'), undefined, true)
                }
            };

            var target = {
                id: 4818,
                meta: {
                    attachments: '',
                    challengeType: 'poll',
                    commentsEnabled: true,
                    fistbumpEnabled: true,
                    imagePlacement: '',
                    language: '["Array","nl","en","fr"]',
                    link: '',
                    pinned: false,
                    shareEnabled: false,
                    shareNetworks: '["Array"]'
                },
                name: ''
            };

            var result = transform.reverseTransform(spec, data);

            assert.deepEqual(result, target, 'Language is serialized to JSON');
        });

    });

});
