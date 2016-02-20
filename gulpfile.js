'use strict';

const gulp = require('gulp');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');

gulp.task('jshint', () => 
  gulp.src('./lib/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
);

gulp.task('babel', () => 
  gulp.src('src/index.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('lib'))
  );

gulp.task('default', ['jshint']);