'use strict';

process.env.NODE_PATH = '.:src';

module.exports = function(grunt) {
    var _ = require('lodash');
    var packageJson = grunt.file.readJSON('package.json');

    // Load all grunt-* and gruntify-* devDependencies
    _.chain(packageJson.devDependencies || {})
        .map(function(v, d){ return /^grunt(-|ify-)/.test(d) ? d : false; })
        .filter().each(grunt.loadNpmTasks).value();

    // Load all custom tasks
    _(grunt.file.expand('./grunt/tasks/**/*.js'))
        .map(require)
        .each(function( task ) { task(grunt); })
        .run();

    // Load task configurations.
    grunt.initConfig(_.merge.apply(_,
        _(grunt.file.expand('./grunt/config/**/*.js'))
        .map(require)
        .map(function(config) { return _.isFunction(config) ? config(grunt) : config; })
        .value()
    ));

    grunt.registerTask('build', [ 'test', 'babel', 'copy:readme' ]);
    grunt.registerTask('test', ['eslint', 'mocha_istanbul']);
};
