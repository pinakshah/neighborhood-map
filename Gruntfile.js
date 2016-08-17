module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
	      src: ['dist']
	    },
        watch: {
		    scripts: {
		        files: ['src/js/*/*.js'],
		        tasks: ['concat', 'uglify'],
		    },
		},
        uglify: {
		    build: {
				files : {
			      'dist/js/lib/bootstrap.min.js' : 'src/js/lib/bootstrap.js',
			      'dist/js/app.min.js' : 'src/js/app.js',
			    }
		    }
		},
        concat: {
		    dist: {
		        src: ['dist/js/lib/bootstrap.min.js', 'dist/js/app.min.js'],
		        dest: 'dist/js/scripts.js',
		    },
		}
    });

    grunt.registerTask('default', ['clean','uglify', 'concat'] );
    //grunt.registerTask('default', ['uglify', 'concat'] );
    grunt.registerTask('mergejs', ['concat'] );

};