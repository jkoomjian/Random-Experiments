"use strict";

const gulp = require("gulp");
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', () => {
  gulp.src('style.scss')
      .pipe(sass())
      .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
      .pipe(gulp.dest('.'));
});

gulp.task('watch', () => {
  gulp.watch(['*.scss'], ['sass']);
});

gulp.task('default', ['sass'], () => {
});