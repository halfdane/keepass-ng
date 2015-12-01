import gulp from 'gulp';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';

var browserify = require('browserify');
var babel = require('babelify');

var transform = require('vinyl-transform');

var mochaPhantomJS = require('gulp-mocha-phantomjs');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

import electron_connect from 'electron-connect';
const electron = electron_connect.server.create();

const $ = gulpLoadPlugins();

// Optimize images
gulp.task('images', () =>
        gulp.src('src/browser/images/**/*')
                .pipe($.cache($.imagemin({
                    progressive: true,
                    interlaced: true
                })))
                .pipe(gulp.dest('dist/browser/images'))
                .pipe($.size({title: 'images'}))
);

gulp.task('styles', () => {
    // For best performance, don't add Sass partials to `gulp.src`
    return gulp.src([
                'src/browser/styles/**/*.scss',
                'src/browser/styles/**/*.css'
            ])
            .pipe($.newer('.tmp/browser/styles'))
            .pipe($.sourcemaps.init())
            .pipe($.sass({
                precision: 10
            }).on('error', $.sass.logError))
            .pipe(gulp.dest('.tmp/browser/styles'))
            .pipe($.if('*.css', $.minifyCss()))
            .pipe($.sourcemaps.write('./'))
            .pipe(gulp.dest('dist/browser/styles'));
});

gulp.task('transpile-production', () => {
    return gulp.src(['src/**/*.js', '!src/spec'])
            .pipe($.newer('.tmp/'))
            .pipe($.sourcemaps.init())
            .pipe($.babel({presets: ['es2015']}))
            .pipe($.sourcemaps.write())
            .pipe(gulp.dest('.tmp/'))
            .pipe($.uglify({preserveComments: 'some'}))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest('dist/'));
});

gulp.task('html', () => {
    return gulp.src('src/**/*.html')
            .pipe(gulp.dest('.tmp'))
            .pipe(gulp.dest('dist'))
            .pipe($.size({title: 'html', showFiles: true}));
});

// Copy all remaining files at the root level of browser.
gulp.task('copy', () =>
        gulp.src([
                    'src/**/*',
                    '!src/**/*.js',
                    '!src/**/*.html',
                    '!src/**/*.css',
                    '!src/**/images/*'
                ], {dot: true})
                .pipe(gulp.dest('.tmp/browser'))
                .pipe(gulp.dest('dist/browser'))
                .pipe($.size({title: 'copy'}))
);

// Clean output directory
gulp.task('clean', () => del(['.tmp', 'dist'], {dot: true}));

gulp.task('serve', ['default'], function () {
    electron.start();
    gulp.watch('dist/app/**', electron.restart);
    gulp.watch('dist/browser/**', electron.reload);
});

// Build production files, the default task
gulp.task('default', cb =>
        runSequence(
                'clean',
                'styles',
                ['html', 'transpile-production', 'images', 'copy'],
                cb
        )
);