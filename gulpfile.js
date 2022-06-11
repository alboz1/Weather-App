const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const minify = require('gulp-minify');

function generateCss() {
    return gulp.src('src/sass/*.sass')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('public/css'));
}

function minifyhtml() {
    return gulp.src('src/*.html')
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

gulp.task('default', gulp.series(generateCss, compress, minifyhtml, watch));