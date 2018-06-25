var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('setup', () => {
    return gulp.src([
        'node_modules/requirejs/require.js',
        'node_modules/lodash/lodash.js'
    ]).pipe(gulp.dest('src/browser/lib'));
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

gulp.task('compile', ['compile-browser', 'compile-server']);

gulp.task('default', ['compile']);
