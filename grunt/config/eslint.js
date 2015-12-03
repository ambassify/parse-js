'use strict';

module.exports = {
    eslint: {
        options: {
            fix: true,
            cache: true
        },
        src: [
            'src/**/*.{js,jsx}'
        ],
        grunt: [
            'Gruntfile.js',
            'grunt/**/*.js'
        ],
        test: {
            options: {
                globals: [ 'it', 'describe' ],
                rules: {
                    // Mocha syntax uses callbacks A LOT!
                    'max-nested-callbacks': 0
                }
            },
            src: [
                'test/**/*.js'
            ]
        }
    }
};
