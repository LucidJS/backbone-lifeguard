// grunt.js (c) 2012 LucidJS and other contributors
// Node-monitor may be freely distributed under the MIT license.
// For all details and documentation:
// http://lucidjs.github.com/backbone-lifeguard

// Build automation tasks
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/* <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */'
    },
    lint: {
      files: ['grunt.js', 'backbone-lifeguard.js', 'test/*.js']
    },
    test: {
      files: ['test/*.js']
    },
    watch: {
      files: ['grunt.js', 'backbone-lifeguard.js', 'test/*.js'],
      tasks: 'default'
    },
    min: {
      all: {
        src: ['<banner>', './backbone-lifeguard.js'],
        dest: './backbone-lifeguard-min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      },
      globals: {
        exports: true
      }
    }
  });

  // Register grunt tasks
  grunt.registerTask('default', 'lint test');
  grunt.registerTask('dist', 'default min:all');

};
