var gulp = require('gulp');
var exec = require('child_process').exec;
var sequence = require('run-sequence');

gulp.task('setup', () => {
    return gulp.src([
        'node_modules/requirejs/require.js',
        'node_modules/lodash/lodash.js',
        'node_modules/react/umd/react.development.js',
        'node_modules/react-dom/umd/react-dom.development.js',
        'node_modules/pixi.js/dist/pixi.js',
    ]).pipe(gulp.dest('src/browser/lib'));
});
gulp.task('setup-anguli', () => {
    return gulp.src([
        'node_modules/@irysius/anguli-components/**/*.js'
    ]).pipe(gulp.dest('src/browser/lib/anguli-components'));
});
gulp.task('compile-browser', (done) => {
    exec('node-tsc -p src/browser', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        done(); // continue even with errors.
    });
});

gulp.task('compile-server', (done) => {
    exec('node-tsc -p src/server', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        done(); // continue even with errors.
    });
});

gulp.task('compile', (done) => {
    sequence('compile-browser', 'compile-server', done);
});

gulp.task('default', ['compile']);
