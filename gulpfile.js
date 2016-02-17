const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
require('gulp-util');
const webpack = require('webpack-stream');
const babel = require('babel-loader');


gulp.task('mocha', () => {
  return gulp.src('test/*test*.js')
    .pipe(mocha({ reporter: 'nyan' }));
});

gulp.task('watch-mocha', () => {
  gulp.watch(['lib/**', 'test/**'], ['mocha']);
});

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!**/node_modules/*'])
    .pipe(eslint.format());
});

gulp.task('html:dev', () => {
  gulp.src(__dirname + '/app/**/*.html')
    .pipe(gulp.dest(__dirname + '/build'));
});

gulp.task('webpack:dev', () => {
  gulp.src(__dirname + '/app/js/client.js')
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      }
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('webpack:test', () => {
  gulp.src(__dirname + '/test/test_entry.js')
    .pipe(webpack({
      output: {
        filename: 'test_bundle.js'
      }
    }))
    .pipe(gulp.dest('test/'));
});


gulp.task('build:dev', ['webpack:dev', 'html:dev']);
gulp.task('default', ['lint', 'mocha']);
