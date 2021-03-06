'use strict';

const gulp = require('gulp');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const mocha = require('gulp-spawn-mocha');
const nodemon = require('gulp-nodemon');
const clean = require('gulp-clean');

gulp.task('jshint', () =>
  gulp.src(['./src/**/*.js', './test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
);

gulp.task('clean', () =>
  gulp.src('lib').pipe(clean())
);

gulp.task('build', ['clean'], () =>
  gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'))
);

gulp.task('test', ['jshint', 'build'], () =>
  gulp.src('test/**/*.js', { read: false })
    .pipe(mocha({
      R: 'nyan',
      compilers: 'js:babel-core/register'
    }))
);

gulp.task('run', ['build'], () => 
  nodemon({
    script: 'lib/index.js',
    ext: 'js',
    ignore: ['node_modules', 'lib', '.git'],
    tasks: ['build']
  })
);

gulp.task('default', ['jshint', 'test']);