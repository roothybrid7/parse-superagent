/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      js: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    mochaTest: {
      options: {
        reporter: 'mocha-unfunk-reporter',
        glowl: true
      },
      cloudUnit: {
        options: {
          bail: true
        },
        src: ['test/**/*_spec.js']
      },
    },
    watch: {
      files: ['<%= jshint.js.src %>'],
      tasks: ['default']
    }
  });

  // These plugins provide necessary tasks.
  var pkg = grunt.config.get('pkg');
  for (var name in pkg.devDependencies) {
    if (name.substring(0, 6) === 'grunt-') {
      grunt.loadNpmTasks(name);
    }
  }

  // Default task.
  grunt.registerTask('default', ['jshint', 'mochaTest']);

};
