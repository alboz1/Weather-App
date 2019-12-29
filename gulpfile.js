const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const minify = require('gulp-minify');

function generateCss() {
    return gulp.src('src/sass/main.sass')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('public/css'));
}

function minifyhtml() {
    return gulp.src('src/index.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('public'));
}

function compress() {
    return gulp.src('src/js/*.js')
            .pipe(minify())
            .pipe(gulp.dest('public/js'))
}

function watch() {
    return gulp.watch(['src/sass/*.sass', 'src/index.html', 'src/js/*.js'], gulp.series(generateCss, minifyhtml, compress));
}

function build() {
    return gulp.src('src/**')
        .pipe((gulp.dest('public')))
}
gulp.task('build', build);

gulp.task('default', gulp.series(generateCss, compress, minifyhtml, watch));