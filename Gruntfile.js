module.exports = function(grunt){
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),

		watch:{
			options:{livereload:true},
			files:['public/**','assets/**'],
			tasks:[]
		},
		express: {
	    server: {
	      options: {
					livereload:true,
					hostname:'localhost',
	        port: 3000,
	        bases: 'public'
	      }
	    }
  	}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-parallel');
	grunt.registerTask('server',['express','watch']);

	};
