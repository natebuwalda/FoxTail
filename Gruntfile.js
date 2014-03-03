module.exports = function(grunt) {
  grunt.initConfig({
    //pkg: grunt.file.readJSON('package.json'),
    'compile-handlebars': {
      buildStatic: {
        template: 'templates/*.html',
        templateData: 'templates/empty.json',
        output: 'htdocs/*.html',
        //helpers: 'test/helpers/**/*.js',
        partials: 'partials/*.html'
      } 
    }
  });
  grunt.loadNpmTasks('grunt-compile-handlebars');
  grunt.registerTask('default',['compile-handlebars']);
};
