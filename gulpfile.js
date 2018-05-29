'use strict';

const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const del = require('del');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const exec = require('child_process').exec;

// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

// Gulp task to minify CSS files
gulp.task('styles', () => {
    return gulp.src('./public/sass/*.scss')
        .pipe(sass({
            outputStyle: 'nested',
            precision: 10,
            includePaths: ['.'],
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe(csso())
        .pipe(gulp.dest('./public/assets/css'))
});

// Gulp task to minify JavaScript files
gulp.task('scripts', () => {
    return gulp.src('./public/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public/assets/js'))
});

// Start node server
gulp.task('server', (cb) => {
    exec('npm start', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
})

// Clean output directory
gulp.task('clean', () => del(['dist']));

// Gulp task to minify all files
gulp.task('default', ['clean'], () => {
    // Automation
    gulp.watch("./public/sass/*.scss", ['styles']);
    gulp.watch("./public/js/**/*.js", ['scripts']);

    runSequence('styles', 'scripts', 'server');
});
