//
// Define Gulp plugin config options
// --------------------------------------------

// Configure Auto Prefixer (https://github.com/sindresorhus/gulp-autoprefixer / https://github.com/ai/browserslist)
var autoprefixerOptions = {
	browsers: ['IE 8', 'IE 9', 'last 2 versions']
};

// Configure Main Bower Files (https://github.com/ck86/main-bower-files)
var mainBowerFilesOptions = {
	paths: {
		bowerrrc: './',
		bowerJson: 'bower.json'
	}
};

// assign gulp-bless options
var blessOptions = {
	imports: true, // import split files rather than outputting various files
	suffix: '-chunk' // override the default suffix of '-blessed'
}

//
// Beginning of Gulp processes
// --------------------------------------------

// Include gulp
var gulp = require('gulp');

var es = require('event-stream');
var gutil = require('gulp-util');

// Include plugins
var plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
	replaceString: /\bgulp[\-.]/
});

// Define config file
var config = require('./gulpconfig.json');

// Allows gulp --dev to be run for a more verbose output
var isProduction = true;
var sassStyle = 'compressed';

if (gutil.env.dev === true) {
	isProduction = false;
	sassStyle = 'expanded';
}

gulp.task('css', loadStyles());
gulp.task('js', loadScripts());

function loadStyles() {
	var theme = gutil.env.type;

	if (theme && config.styles[theme]) {
		// requested theme
		config.styles[theme].forEach(function(data) {
			watchStyles(data);
		});
	} else {
		// all
		for (var theme in config.styles) {
			config.styles[theme].forEach(function(data) {
				watchStyles(data);
			});
		}
	}
}

function buildStyles(data) {
	var css = gulp.src(data.src)
		// init sourcemaps plugin when not for production
		.pipe(isProduction ? gutil.noop() : plugins.sourcemaps.init())
		// init plumber for error reporting and stop compilation
		.pipe(plugins.plumber({
			errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
			}
		}))
		// compile the sass
		.pipe(plugins.sass({
			outputStyle: sassStyle,
			precision: 8
		}))
		// assign dest(s) from our gulpconfig
		.pipe(plugins.concat(data.dest.filename))
		// push sass through broser auto-prefixer
		.pipe(plugins.autoprefixer(autoprefixerOptions))
		// pipe through bless plugin to split large css sheets to
		// avoid IE9 file length bug when in production environment
		.pipe(isProduction ? plugins.bless(blessOptions) : gutil.noop())
		// minify scss when for production
		.pipe(isProduction ? plugins.cleanCss({advanced:false}) : gutil.noop())
		// write sourcemaps when not in a production environment
		.pipe(isProduction ? gutil.noop() : plugins.sourcemaps.write())
		// output file sizes
		.pipe(plugins.size({showFiles:true,title:'Output'}))

	// Output file to each destination in paths
	if (typeof data.dest.paths === 'string') {
		css.pipe(gulp.dest(data.dest.paths));
	} else {
		for (var i=0; i<data.dest.paths.length; i++) {
			css.pipe(gulp.dest(data.dest.paths[i]));
		}
	}

	// add blank line to aid output readability
	gutil.log('');

	return;
}

function watchStyles(data) {
	gulp.watch(data.watch, ['css']).on('change', function(evt) {
		buildStyles(data);
		changeEvent(evt, data.src);
	});
	return;
}

function loadScripts() {
	var theme = gutil.env.type;

	if (theme && config.scripts[theme]) {
		// requested theme
		config.scripts[theme].forEach(function(data) {
			watchScripts(data);
		});
	} else {
		// all
		for (var theme in config.scripts) {
			config.scripts[theme].forEach(function(data) {
				watchScripts(data);
			});
		}
	}
	return;
}

function watchScripts(data) {
	gulp.watch(data.watch, ['js']).on('change', function(evt) {
		buildScripts(data);
		changeEvent(evt, data.src);
	});
	return;
}

function buildScripts(data) {
	var js = gulp.src(plugins.mainBowerFiles(mainBowerFilesOptions).concat(data.src))
			.pipe(plugins.filter('*.js'))
			.pipe(plugins.concat(data.dest.filename))
			.pipe(isProduction ? plugins.uglify() : gutil.noop())
			.pipe(plugins.size({showFiles:true,title:'Output'}));

	// Output file to each destination in paths
	if (typeof data.dest.paths === 'string') {
		js.pipe(gulp.dest(data.dest.paths));
	} else {
		for (var i=0; i<data.dest.paths.length; i++) {
			js.pipe(gulp.dest(data.dest.paths[i]));
		}
	}

	// add blank line to aid output readability
	gutil.log('');

	return;
}

var changeEvent = function(evt, src) {
	gutil.log('File', gutil.colors.cyan(evt.path), 'was', gutil.colors.magenta(evt.type));
	return;
};

gulp.task('default', ['css', 'js']);
