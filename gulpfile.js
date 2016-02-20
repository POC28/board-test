'use strict';

const gulp = require('gulp');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const clean = require('gulp-clean');

gulp.task('jshint', () =>
  gulp.src(['./src/**/*.js', './test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
);

gulp.task('babel', () =>
  gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'))
);

gulp.task('test', () =>
  gulp.src('test/**/*.js')
    .pipe(mocha({
      reporter: 'nyan',
      compilers: {
        js: require('babel-core/register')
      }
    }))
);

gulp.task('run', () => 
  nodemon({
    script: 'lib/index.js',
    ext: 'js',
    ignore: ['node_modules', 'lib', '.git'],
    tasks: ['babel']
  })
);

gulp.task('default', ['jshint', 'babel', 'test']);