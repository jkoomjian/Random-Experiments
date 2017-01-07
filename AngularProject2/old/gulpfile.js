"use strict";

const gulp = require("gulp");
const babel = require('gulp-babel');
const del = require('del');

gulp.task('clean', () => {
  del.sync('build');
});

gulp.task('default', ['clean'], () => {
  gulp.src("src/*.js")
    .pipe(babel( {presets: ['es2015']} ))
    // .pipe(babel( {presets: ['es2015'], plugins: ["transform-es2015-modules-amd"]} ))
    .pipe(gulp.dest('build'));
});