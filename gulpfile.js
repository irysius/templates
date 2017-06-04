var gulp = require('gulp');
var rename = require('gulp-rename');
var fs = require('fs');
var rimraf = require('rimraf');
var exec = require('child_process').exec;
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('clean', function (done) {
	rimraf('./build', done);
});

gulp.task('copy', function () {
	gulp.src([
		'src/**/*.html',
		'src/**/*.css'
	]).pipe(gulp.dest('build'));
});

gulp.task('copy-test', function () {
	gulp.src([
		'build/**/*.js',
		'!build/lib/**/*.*'
	]).pipe(gulp.dest('tests/js'));
});

gulp.task('copy-deps', function (done) {
	gulp.src([
		'node_modules/axios/dist/axios.min.js',
		'node_modules/lodash/lodash.min.js',
		'node_modules/requirejs/require.js'
	]).pipe(rename(function (path) {
		path.basename = path.basename.replace(/\.min/g, '');
	})).pipe(gulp.dest('build/lib'));
});

gulp.task('fix-typings', function (done) {
	function fixGlobalModuleExports(module, lineToReplace) {
		var moduleLocation = './typings/modules/' + module + '/index.d.ts';
		return new Promise((resolve, reject) => {
			fs.readFile(moduleLocation, (err, data) => {
				if (err) { reject(err); return; }
				var text = data.toString();
				var fixedText = text.replace(lineToReplace, '');
				fs.writeFile(moduleLocation, fixedText, err => {
					err ? reject(err) : resolve();
				});
			});
		});
	}
	Promise.all([
		fixGlobalModuleExports('lodash', 'export as namespace _;')
	]).then(() => {
		done();
	}).catch(err => {
		done(err);
	});
	
});

gulp.task('copy-deps-test', function (done) {
	gulp.src([
		'node_modules/axios/dist/axios.min.js',
		'node_modules/lodash/lodash.min.js',
		'node_modules/requirejs/require.js',
		'node_modules/chai/chai.js',
		'node_modules/mocha/mocha.js',
		'node_modules/mocha/mocha.css'
	]).pipe(rename(function (path) {
		path.basename = path.basename.replace(/\.min/g, '');
	})).pipe(gulp.dest('tests/lib'));
});

gulp.task('compile', function (done) {
	exec('tsc', function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		done(err);
	});
});

gulp.task('compile-test', function (done) {
	exec('tsc -p tests', function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		done(err);
	});
});

gulp.task('watch', function () {
	gulp.watch([
		'src/**/*.ts',
		'tests/**/*.ts'
	], ['compile', 'compile-test']);
});

gulp.task('serve', ['compile', 'copy'], function () {
	browserSync.init({
		notify: false,
		startPath: 'index.html',
		server: {
			baseDir: './build'
		}
	});

	gulp.watch([
		'src/**/*.ts',
		'src/css/**/*.css',
		'src/**/*.html'
	], ['compile', 'copy', reload]);
});

gulp.task('serve-test', ['compile', 'compile-test', 'copy-test'], function () {
	browserSync.init({
		notify: false,
		startPath: 'index.html',
		server: {
			baseDir: './tests'
		}
	});

	gulp.watch([
		'src/**/*.ts',
		'src/css/**/*.css',
		'src/**/*.html',
		'tests/**/*.ts',
		'tests/**/*.html'
	], ['compile', 'compile-test', 'copy', reload]);
});

// Perform a one time set up after pull dependencies to copy them to the appropriate folders
gulp.task('setup', ['copy-deps', 'copy-deps-test', 'fix-typings'])

gulp.task('default', ['watch']);