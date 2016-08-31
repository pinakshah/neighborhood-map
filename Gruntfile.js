module.exports = function(grunt) {

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        /* Clear out the dist directory if it exists */
	    clean: {
	      src: ['dist']
	    },

	    /* Generate the dist directory if it is missing */
	    mkdir: {
	      dist: {
	        options: {
	          create: ['dist']
	        }
	      }
	    },

	    /** Copy fonts */
	    copy: {
	      fonts: {
	        files: [{
	          expand: true,
	          src: ['src/fonts/*'],
	          dest: 'dist/fonts/',
	          filter: 'isFile',
	          flatten: true
	        }]
	      }
	    },

	    /* Minify HTML */
	    htmlmin: {
	      indexhtml: {
	        options: {
	          removeComments: true,
	          collapseWhitespace: true
	        },
	        files: [{
	          expand: true,
	          cwd: 'src/',
	          src: ['**/*.html'],
	          dest: 'dist/'
	        }]
	      }
	    },

	    /** Minify CSS **/
	    cssmin: {
	      options: {
	        report: 'gzip'
	      },
	      css: {
	        files: [{
	          expand: true,
	          cwd: 'src/css',
	          src: ['**/*.css'],
	          dest: 'dist/css/'
	        }]
	      }
	    },

	    /** Minify JS **/
	    uglify: {
			options: {
	        	report: 'gzip'
	      	},
	      	build: {
				files : {
		      		'dist/js/lib/knockout.js' : 'src/js/lib/knockout.js',
		      		'dist/js/app.js' : 'src/js/app.js',
		    	}
			}
	    }
    });

    grunt.registerTask('default', [
	    'clean',
	    'mkdir',
	    'copy',
	    'htmlmin',
	    'cssmin',
	    'uglify'
	]);
};