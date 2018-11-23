var gulp = require('gulp');

// Include all tasks
require('./tasks/lint');
require('./tasks/copy-vars');
require('./tasks/copy-loadIcons');
require('./tasks/icons');
require('./tasks/build-css');
require('./tasks/build-docs');
require('./tasks/clean');
require('./tasks/gh-pages');
require('./tasks/build');
require('./tasks/dev');
require('./tasks/build-backstop');
require('./tasks/test-backstop');
require('./tasks/test');
require('./tasks/docs/generate-docs');

gulp.task('default', gulp.series('build'));
