import gulp from 'gulp';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';

import electron_connect from 'electron-connect';
const electron = electron_connect.server.create();

const $ = gulpLoadPlugins();

// Lint JavaScript
gulp.task('lint', () =>
        gulp.src(['src/app/**/*.js', 'src/browser/**/*.js'])
                .pipe($.jshint({esnext: true}))
                .pipe($.jshint.reporter('jshint-stylish'))
                .pipe($.jshint.reporter('fail'))
);

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

// Copy all files at the root level of browser.
gulp.task('copy', () =>
        gulp.src([
            'src/browser/*',
            '!src/browser/*.html'
        ], {
            dot: true
        }).pipe(gulp.dest('src/browser'))
                .pipe($.size({title: 'copy'}))
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

const trans = dir => {
    return gulp.src('src/' + dir + '/*.js')
            .pipe($.newer('.tmp/' + dir))
            .pipe($.sourcemaps.init())
            .pipe($.babel({
                presets: ['es2015']
            }))
            .pipe($.sourcemaps.write())
            .pipe(gulp.dest('.tmp/' + dir))
            .pipe($.uglify({preserveComments: 'some'}))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest('dist/' + dir));

};

gulp.task('transpile-app', () => {
    return trans('app');
});

gulp.task('transpile-browser', () => {
    return trans('browser');
});

gulp.task('scripts', ['scripts-app', 'scripts-browser']);

// Scan your HTML for assets & optimize them
gulp.task('html', () => {
    return gulp.src('src/browser/**/*.html')
            .pipe($.useref({searchPath: '{.tmp,src/browser}'}))
            // Remove any unused CSS
            .pipe($.if('*.css', $.uncss({
                html: [
                    'src/browser/index.html'
                ],
                // CSS Selectors for UnCSS to ignore
                ignore: []
            })))

            // Concatenate and minify styles
            // In case you are still using useref build blocks
            .pipe($.if('*.css', $.minifyCss()))

            // Minify any HTML
            .pipe($.if('*.html', $.minifyHtml()))
            // Output files
            .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
            .pipe(gulp.dest('dist/browser'));
});

gulp.task('copy', () =>
        gulp.src([
            'app/*',
            '!app/*.html'
        ], {
            dot: true
        }).pipe(gulp.dest('dist'))
);

// Clean output directory
gulp.task('clean', cb => del(['.tmp', 'dist'], {dot: true}));

gulp.task('serve', ['default'], function () {
    electron.start();
    gulp.watch('dist/app/**', electron.restart);
    gulp.watch('dist/browser/**', electron.reload);
});

gulp.task('run', ['default'], function () {
    return $.run('electron .').exec();
});

// Build production files, the default task
gulp.task('default', cb =>
        runSequence(
                'styles',
                ['lint', 'html', 'transpile-app', 'transpile-browser', 'images', 'copy'],
                cb
        )
);