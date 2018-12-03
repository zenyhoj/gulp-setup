var gulp = require('gulp');
var inject = require('gulp-inject');
var webserver = require('gulp-webserver');

var htmlclean = require('gulp-htmlclean');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var paths = {
    src: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcCSS: 'src/**/*.css',
    srcJS: 'src/**/*.js',
    tmp: 'tmp', // tmp folder
    tmpIndex: 'tmp/index.html', // index.html in tmp folder
    tmpCSS: 'tmp/**/*.css', // css files in tmp folder
    tmpJS: 'tmp/**/*.js', // js files in tmp folder
    dist: 'dist',
    distIndex: 'dist/index.html',
    distCSS: 'dist/**/*.css',
    distJS: 'dist/**/*.js'
};


gulp.task('default', ['watch']);

// a task to copy all HTML files from the src directory to the tmp directory where you’ll be running the web server.
gulp.task('html', function () {
    return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
});

gulp.task('css', function () {
    return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.tmp));
});

gulp.task('js', function () {
    return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
});

gulp.task('copy', ['html', 'css', 'js']);
// end of copying from src to tmp folder


// task to inject the files.
gulp.task('inject', ['copy'], function () {
    var css = gulp.src(paths.tmpCSS);
    var js = gulp.src(paths.tmpJS);
    return gulp.src(paths.tmpIndex)
        .pipe(inject(css, {
            relative: true
        }))
        .pipe(inject(js, {
            relative: true
        }))
        .pipe(gulp.dest(paths.tmp));
});

gulp.task('serve', ['inject'], function () {
    return gulp.src(paths.tmp)
        .pipe(webserver({
            port: 3000,
            livereload: true
        }));
});

// watch for changes
gulp.task('watch', ['serve'], function () {
    gulp.watch(paths.src, ['inject']);
});



// create the build tasks.
gulp.task('html:dist', function () {
    return gulp.src(paths.srcHTML)
        .pipe(htmlclean())
        .pipe(gulp.dest(paths.dist));
});
gulp.task('css:dist', function () {
    return gulp.src(paths.srcCSS)
        .pipe(concat('style.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.dist));
});
gulp.task('js:dist', function () {
    return gulp.src(paths.srcJS)
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist));
});
gulp.task('copy:dist', ['html:dist', 'css:dist', 'js:dist']);
gulp.task('inject:dist', ['copy:dist'], function () {
    var css = gulp.src(paths.distCSS);
    var js = gulp.src(paths.distJS);
    return gulp.src(paths.distIndex)
        .pipe(inject(css, {
            relative: true
        }))
        .pipe(inject(js, {
            relative: true
        }))
        .pipe(gulp.dest(paths.dist));
});
gulp.task('build', ['inject:dist']);
//   end of build tasks