"use strict";

module.exports = function(grunt) {
    var updateFragment = function( i ) {
            var files = [];
            this.files.forEach(function( file ) {
                files = files.concat(file.src.filter(function(path) {
                    return grunt.file.exists(path);
                }));
            });

            if( files.length == 0 && grunt.file.exists('package.json') )
                files.push('package.json');

            if( !files.length )
                throw new Error('No valid package.json files supplied');

            var pkg = grunt.file.readJSON(files[0]);
            var version = (pkg.version||'0.0.0').split('.');

            version[i]++;
            while( ++i < 3 )
                version[i] = 0;

            version = version.join('.');

            files.map(function(path) {
                var json = grunt.file.readJSON(path);
                json.version = version;
                grunt.file.write(path, JSON.stringify(json, null, 2));
            });
        },
        update = function(i) {
            return function() { return updateFragment.call(this, i); }
        };

    grunt.registerMultiTask('version', function() {
        var position = ['major', 'minor', 'patch'].indexOf(this.data.position || this.target);

        if( position < 0 )
            throw new Error('Invalid position');

        updateFragment.call(this, position);
    });
    grunt.registerTask('version-major', update(0));
    grunt.registerTask('version-minor', update(1));
    grunt.registerTask('version-patch', update(2));
}
