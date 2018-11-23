var gulp = require('gulp');
require('./docs/generate-docs');

var browserSync = require('browser-sync').create();

function reload(done) {
  browserSync.reload();
  done();
}

function injectCSS() {
  return gulp.src('dist/*.css')
    .pipe(browserSync.stream());
}

function injectDocsResources() {
  return gulp.src('dist/docs/css/docs.css')
    .pipe(browserSync.stream());
}

function serve(path) {
  return function(done) {
    browserSync.init({
      port: 8080,
      ui: {
        port: 3000,
        weinre: {
          port: 3001
        }
      },
      startPath: path,
      server: {
        baseDir: [
          './dist/'
        ],
        directory: true
      },
      watchOptions: {
        awaitWriteFinish: true
      }
    });
    done();
  }; 
}

function watchOldDocs() {
  gulp.watch([
    'docs/**/*.yml',
    'topdoc/lib/template.pug',
    'topdoc/lib/index.js',
    'tasks/resources/docs/js/*.js'
  ], gulp.series('reload-docs'));

  gulp.watch([
    'tasks/resources/docs/css/*.css'
  ], gulp.series('reload-docs-css'));

  gulp.watch('icons/*.svg', gulp.series('reload-icons'));
}

function watchNewDocs() {
  gulp.watch([
    'tasks/resources/docs/js/*.js',
    'tasks/docs/*.pug'
  ], gulp.series('reload-new-docs'));

  gulp.watch([
    'tasks/resources/docs/css/*.css'
  ], gulp.series('reload-new-docs-css'));

  gulp.watch('icons/*.svg', gulp.series('reload-icons'));
}

function watchCSSLite() {
  gulp.watch('src/**/*.css', gulp.series('reload-css-lite'));
}

function watchCSS() {
  gulp.watch('src/**/*.css', gulp.series('reload-css'));
}

gulp.task('reload-css-lite', gulp.series('build-css-lite', injectCSS));
gulp.task('reload-css', gulp.series('build-css', injectCSS));

gulp.task('reload-docs-css', gulp.series('build-docs:copy-site-resources', injectDocsResources));
gulp.task('reload-new-docs-css', gulp.series('generate-docs:copy-site-resources', injectDocsResources));

gulp.task('reload-docs', gulp.series('build-docs', reload));
gulp.task('reload-new-docs', gulp.series('generate-docs', reload));
gulp.task('reload-icons', gulp.series('icons', reload));

gulp.task('dev', gulp.series('build', 'build-docs', serve('docs/index.html'), gulp.parallel(watchOldDocs, watchCSSLite)));
gulp.task('dev-heavy', gulp.series('build', 'build-docs', serve('docs/index.html'), gulp.parallel(watchOldDocs, watchCSS)));

gulp.task('dev-docs', gulp.series('build', 'generate-docs', serve('gendocs/index.html'), gulp.parallel(watchNewDocs, watchCSSLite)));
