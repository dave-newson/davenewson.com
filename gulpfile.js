'use strict';

var gulp        = require('gulp');
var gutil       = require('gulp-util');
var sourcemaps  = require('gulp-sourcemaps');
var less        = require('gulp-less');
var cssmin      = require('gulp-cssmin');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var rename      = require('gulp-rename');
var glob        = require('glob');

//// Build
gulp.task('default', function() {

    // Build JS to min
    gulp.src(
        [
            './src/content/assets/js/*.js',
            '!**/*.min.*'
        ])
        // Minify
        .pipe(uglify())
        // Rename
        .pipe(rename({suffix: '.min'}))
        // Output it to our dist folder
        .pipe(gulp.dest('./src/content/assets/js/'));

    // Build CSS
    gulp.src(
        [
            './src/content/assets/less/main.less',
            '!**/*.min.*'
        ])
        // LESS Compile
        .pipe(less({}))
        // Minify
        .pipe(cssmin())
        // Bundle to a single file
        .pipe(concat('styles.min.css'))

        // Output it to our dist folder
        .pipe(gulp.dest('./src/content/assets/css/'));


});

gulp.task('watch', [], function() {
    // Watch our scripts
    gulp.watch([
        './src/content/assets/js/*.js',
        './src/content/assets/less/*.less',
    ],[
        'default',
    ]);
});