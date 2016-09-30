var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var rename = require("gulp-rename");
var cleanCSS = require("gulp-clean-css");
var sass = require('gulp-sass');

gulp.task('styles', function () {
  return gulp.src('styles/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'safari 5', 'ios 6', 'android 4']
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('styles/'))
    .pipe(livereload())
});

gulp.task('deploy', ['styles'], () => {
  return gulp.src([
    "api/**",
    "bower_components/**",
    "favicon/favicon.png",
    "images/**",
    "js/**",
    "plugins/**",
    "styles/*.css",
    "templates/**",
    "keybase.txt",
    "index.html"
  ], {base: "."})
    .pipe(gulp.dest("public/"))
});

gulp.task("watch", () => {
  livereload.listen();
  gulp.watch('styles/*.scss', ['styles']);
});
