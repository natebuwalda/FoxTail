module.exports = function(grunt) {
  grunt.initConfig({
    //pkg: grunt.file.readJSON('package.json'),
    'compile-handlebars': {
      buildStatic: {
        template: 'templates/*.html',
        templateData: 'templates/*.json',
        output: 'htdocs/*.html',
        //helpers: 'test/helpers/**/*.js',
        partials: 'partials/*.html'
      } 
    },
    'watch': {
      templates: {
        files: ['templates/*.html'],
        tasks: ['compile-handlebars'],
        options: { spawn: false }
      },
      json: {
        files: ['templates/*.json'],
        tasks: ['compile-handlebars'],
        options: { spawn: false }
      }
    }
  });
  grunt.loadNpmTasks('grunt-compile-handlebars');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default',['watch']);
};
