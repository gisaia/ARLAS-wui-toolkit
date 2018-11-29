const gulp = require('gulp');
const gulpClean = require('gulp-clean');
const inlineResources = require('./tools/inline-resources');

function copyHtml() {
    return gulp.src('src/app/**/*.html')
        .pipe(gulp.dest('./dist')).on('end', copyAssets);
}

function copyDts() {
    return gulp.src('src/app/**/*.d.ts')
        .pipe(gulp.dest('./dist')).on('end', copyAssets);
}

function copyJS() {
    return gulp.src('src/app/**/*.js')
        .pipe(gulp.dest('./dist')).on('end', copyAssets);
}

function copyscriptJS() {
    return gulp.src('src/script/*.js')
        .pipe(gulp.dest('./dist')).on('end', copyAssets);
}

function copyAssets() {
    return gulp.src('./src/assets/**/*')
        .pipe(gulp.dest('./dist/assets')).on('end', copyScss);
}

function copyScss() {
    return gulp.src('./src/app/**/*.{scss,css}')
        .pipe(gulp.dest('./dist')).on('end', inlineResource);
}

function inlineResource() {
    inlineResources('./dist/**');
}

function cleanDistNodeModules() {
    return gulp.src('dist/node_modules')
        .pipe(gulpClean(null));
}

function cleanDistSrc() {
    return gulp.src('dist/src')
        .pipe(gulpClean(null));
}

function copyData() {
    return gulp.src('src/app/**/*.json')
      .pipe(gulp.dest('dist/'));
  };

gulp.task('build:clean-dist-node_modules', cleanDistNodeModules);
gulp.task('build:clean-dist-src', cleanDistSrc);
gulp.task('build:copy-and-inline-resource', copyHtml);
gulp.task('build:copy-and-inline-dts', copyDts);
gulp.task('build:copy-and-inline-js', copyJS);
gulp.task('build:copy-and-inline-script-js', copyscriptJS);

gulp.task('build:copy-resources', copyData);

gulp.task('default', gulp.series('build:copy-and-inline-resource',
'build:copy-and-inline-dts',
'build:copy-and-inline-js',
'build:copy-and-inline-script-js',
'build:clean-dist-node_modules',
'build:clean-dist-src',
'build:copy-resources'));
