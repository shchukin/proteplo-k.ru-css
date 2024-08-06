var del = require('del');
var run = require('gulp4-run-sequence');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var stylelint = require('gulp-stylelint');
var cleanCSS = require('gulp-clean-css');
var size = require('gulp-size');
var postcss = require('gulp-postcss');
var postcssPresetEnv = require('postcss-preset-env');
var postcssHoverMediaFeature = require('postcss-hover-media-feature');
var base64 = require('gulp-base64');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var change = require('gulp-change');


function addSourcesTimestamp(content) {
    var source = content.split('\n');
    var outputLine = '';
    var result = '';

    var timestamp = Math.round(new Date().getTime() / 1000);


    source.forEach(function (line) {

        if (line.indexOf('rel="stylesheet"') !== -1) {
            outputLine = line.replace('.css"', '.css?' + timestamp + '"');
            result += outputLine + '\n';
        } else if (line.indexOf('<script') !== -1 && line.indexOf('src="') !== -1 && line.indexOf('vendors/') === -1) {
            outputLine = line.replace('.js"', '.js?' + timestamp + '"');
            result += outputLine + '\n';
        } else {
            result += line + '\n';
        }

    });

    return result;
}


function uncommentYandexMaps(content) {
    var source = content.split('\n');
    var outputLine = '';
    var result = '';

    source.forEach(function (line) {

        if (line.indexOf('api-maps.yandex.ru') !== -1) {
            outputLine = line;
            outputLine = outputLine.replace('<!--', '');
            outputLine = outputLine.replace('-->', '');
            result += outputLine + '\n';
        } else {
            result += line + '\n';
        }

    });

    return result;
}


// Clean up build folder

gulp.task('clean', function () {
    return del('build/*');
});


// Manifest: copy

gulp.task('manifest', function () {
    return gulp.src([
        'src/browserconfig.xml',
        'src/manifest.json',
        'src/humans.txt',
        'src/favicon.ico'], {encoding: false})
        .pipe(plumber())
        .pipe(gulp.dest('build/'))
        ;
});


// Favicon: copy

gulp.task('favicon', function () {
    return gulp.src('src/favicon/**/*', {encoding: false})
        .pipe(plumber())
        .pipe(gulp.dest('build/favicon/'))
        ;
});


// Temp: copy

gulp.task('temp', function () {
    return gulp.src('src/temp/**/*', {encoding: false})
        .pipe(plumber())
        .pipe(gulp.dest('build/temp/'))
        ;
});


// Content: copy

gulp.task('content', function () {
    return gulp.src('src/content/**/*', {encoding: false})
        .pipe(plumber())
        .pipe(gulp.dest('build/content/'))
        ;
});


// Images: copy

gulp.task('images', function () {
    return gulp.src('src/images/**/*', {encoding: false})
        .pipe(plumber())
        .pipe(gulp.dest('build/images/'))
        ;
});


// Markups: copy and change symbols <img> to sprite <svg>

gulp.task('markups', function () {
    return gulp.src('src/markups/**/*', {encoding: false})
        .pipe(plumber())
        .pipe(change(uncommentYandexMaps))
        .pipe(change(addSourcesTimestamp))
        .pipe(gulp.dest('build/markups/'))
        ;
});


// Layouts: copy and change symbols <img> to sprite <svg>

gulp.task('layouts', function () {
    return gulp.src('src/*.html', {encoding: false})
        .pipe(plumber())
        .pipe(change(uncommentYandexMaps))
        .pipe(change(addSourcesTimestamp))
        .pipe(gulp.dest('build/'))
        ;
});


// Vendors: copy but exclude normalize

gulp.task('vendors', function () {
    return gulp.src([
        'src/vendors/**/*',
        '!src/vendors/normalize',
        '!src/vendors/normalize/**/*',
    ], {encoding: false})
        .pipe(plumber())
        .pipe(gulp.dest('build/vendors/'))
        ;
});


// Scripts: copy

gulp.task('scripts', function () {
    return gulp.src('src/scripts/**/*', {encoding: false})
        .pipe(plumber())
        .pipe(gulp.dest('build/scripts/'))
        ;
});


// Styles: concat, add prefixes, compress, copy

gulp.task('styles', function () {

    var processors = [
        postcssPresetEnv(),
        postcssHoverMediaFeature()
    ];

    return gulp.src('src/styles/style.css', {encoding: false})
        .pipe(plumber())
        .pipe(cleanCSS({
            advanced: false,
            keepSpecialComments: 0
        }))
        .pipe(postcss(processors))
        .pipe(base64({
            // Allow files from /vectors/ only
            exclude: ['/sprite/', '/images/']
        }))
        .pipe(gulp.dest('build/styles/'))
        .pipe(size())
        ;
});


// lint

gulp.task('lint', function () {

    return gulp.src([
        '!src/styles/style.css',
        'src/styles/**/*.css'
    ], {encoding: false})
        .pipe(plumber())
        .pipe(stylelint({
            reporters: [
                {formatter: 'string', console: true}
            ]
        }))
        ;
});


gulp.task('default', function (fn) {
    run('clean', 'manifest', 'favicon', 'temp', 'content', 'images', 'markups', 'layouts', 'vendors', 'scripts', 'styles', 'lint', fn);
});



