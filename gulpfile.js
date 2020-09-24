const gulp = require('gulp');
const gulpClean = require('gulp-clean');
const inlineResources = require('./tools/inline-resources');

function copyHtml() {
    return gulp.src('src/app/**/*.html')
        .pipe(gulp.dest('./dist'));
}

function copyDts() {
    return gulp.src('src/app/**/*.d.ts')
        .pipe(gulp.dest('./dist'));
}

function copyJS() {
    return gulp.src('src/app/**/*.js')
        .pipe(gulp.dest('./dist'));
}

function copyscriptJS() {
    return gulp.src('src/script/*.js')
        .pipe(gulp.dest('./dist'));
}

function copyAssets() {
    return gulp.src('./src/assets/**/*')
        .pipe(gulp.dest('./dist/assets'));
}

function copyScss() {
    return gulp.src('./src/app/**/*.{scss,css}')
        .pipe(gulp.dest('./dist'));
}

function inlineResource(done) {
    inlineResources('./dist/**');
    done();
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

function copyAssetsi18n() {
    return gulp.src('./src/assets/i18n/*')
        .pipe(gulp.dest('./dist/assets/i18n'));
}

gulp.task('build:clean-dist-node_modules', cleanDistNodeModules);
gulp.task('build:clean-dist-src', cleanDistSrc);
gulp.task('build:copy-html', copyHtml);
gulp.task('build:copy-dts', copyDts);
gulp.task('build:copy-js', copyJS);
gulp.task('build:copy-script-js', copyscriptJS);
gulp.task('build:copy-css', copyScss);
gulp.task('build:copy-json', copyData);
gulp.task('build:copy-assets-i18n', copyAssetsi18n);
gulp.task('build:inline-resources', inlineResource);

gulp.task('default', gulp.series(
  'build:copy-html',
  'build:copy-dts',
  'build:copy-js',
  'build:copy-script-js',
  'build:copy-css',
  'build:clean-dist-node_modules',
  'build:clean-dist-src',
  'build:copy-json',
  'build:copy-assets-i18n',
  'build:inline-resources'
));
