'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
 
gulp.task('sass',  done => {
  return gulp.src('./sass/core.scss') 
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 4 versions'],
      cascade: true
    }))
    .pipe(rename('styles.css'))
    .pipe(gulp.dest('./css'));
    done();
});
 
gulp.task('sass:watch', done => {
  gulp.watch('./sass/**/*.scss', gulp.series('sass'));
  done();
});

gulp.task('default', gulp.parallel(
  'sass',
  'sass:watch'
)
);