"use strict";

const gulp = require("gulp");
const sass = require('gulp-sass');

gulp.task('sass', () => {
  gulp.src('style.scss')
      .pipe(sass())
      .pipe(gulp.dest('.'));
});

gulp.task('watch', () => {
  gulp.watch(['*.scss'], ['sass']);
});

gulp.task('default', ['sass'], () => {
});