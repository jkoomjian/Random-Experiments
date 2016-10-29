"use strict";

const gulp = require("gulp");
const babel = require('gulp-babel');
const del = require('del');

gulp.task('clean', () => {
  del.sync('dist');
});

gulp.task('default', ['clean'], () => {
  gulp.src("src/*.js")
    .pipe(babel( {presets: ['es2015']} ))
    .pipe(gulp.dest('dist'));
});