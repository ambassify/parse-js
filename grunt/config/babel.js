'use strict';

module.exports = function(grunt) {
    return {
        babel:{
            dist: {
                files: grunt.file.expandMapping('**/*.js', 'dist', { cwd: 'src' })
            }
        }
    };
};

