const gulp = require('gulp');
const gulpClean = require('gulp-clean');
const gulpRunSequence = require('run-sequence');
const inlineResources = require('./tools/inline-resources');
const compodoc = require('@compodoc/gulp-compodoc')

const PROJECT_ROOT = process.cwd();

function copyHtml() {
    gulp.src('src/app/**/*.html')
        .pipe(gulp.dest('./dist')).on('end', copyAssets);
}

function copyDts() {
    gulp.src('src/app/**/*.d.ts')
        .pipe(gulp.dest('./dist')).on('end', copyAssets);
}

function copyJS() {
    gulp.src('src/app/**/*.js')
        .pipe(gulp.dest('./dist')).on('end', copyAssets);
}

function copyAssets() {
    gulp.src('./src/assets/**/*')
        .pipe(gulp.dest('./dist/assets')).on('end', copyScss);
}

function copyScss() {
    gulp.src('./src/app/**/*.{scss,css}')
        .pipe(gulp.dest('./dist')).on('end', inlineResource);
}

function inlineResource() {
    inlineResources('./dist/**');
}

function cleanDistNodeModules() {
    gulp.src('dist/node_modules')
        .pipe(gulpClean(null));
}

function cleanDistSrc() {
    gulp.src('dist/src')
        .pipe(gulpClean(null));
}


function generatedoc() {
    gulp.src('src/**/*.ts')
        .pipe(compodoc({
            title: 'ARLAS Web Toolkit',
            output: 'documentation',
            tsconfig: 'tsconfig-build.json',
             disablePrivateOrInternalSupport: true

        }))
}
gulp.task('copy-data', function() {
    return gulp.src('src/app/**/*.json')
      .pipe(gulp.dest('dist/'));
  });


gulp.task('build:clean-dist-node_modules', cleanDistNodeModules);
gulp.task('build:clean-dist-src', cleanDistSrc);
gulp.task('build:copy-and-inline-resource', copyHtml);
gulp.task('build:copy-and-inline-dts', copyDts);
gulp.task('build:copy-and-inline-js', copyJS);
gulp.task('build:copy-resources', ['copy-data']);

gulp.task('build:generatedoc', generatedoc);

gulp.task('build:release', function (done) {
    // Synchronously run those tasks.
    return gulpRunSequence(
        'build:copy-and-inline-resource',
        'build:copy-and-inline-dts',
        'build:copy-and-inline-js',
        'build:clean-dist-node_modules',
        'build:clean-dist-src',
        'build:generatedoc',
        'build:copy-resources',
        done
    );
});

gulp.task('default', ['build:release']);
