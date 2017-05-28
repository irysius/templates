var gulp = require('gulp');
var rename = require('gulp-rename');
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

gulp.task('copy-deps', function (done) {
	gulp.src([
		'bower_components/axios/dist/axios.min.js',
		'bower_components/lodash/dist/lodash.min.js',
		'bower_components/requirejs/require.js'
	]).pipe(rename(function (path) {
		path.basename = path.basename.replace(/\.min/g, '');
	})).pipe(gulp.dest('build/lib'));
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

gulp.task('serve-test', ['compile', 'compile-test', 'copy'], function () {
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

gulp.task('default', ['watch']);