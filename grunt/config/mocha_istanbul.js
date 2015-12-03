'use strict';

module.exports = {
    'mocha_istanbul': {
        options: {
            mochaOptions: [ /* '--bail', '--full-trace' */ ],
            reportFormats: ['html'],
            require: [ 'babel/register' ],
            root: 'src'
        },

        all: { src: 'test/**/*.js', coverageFolder: 'coverage' }
    }
};
