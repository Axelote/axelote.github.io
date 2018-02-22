var lr = require('tiny-lr'), // Минивебсервер для livereload
validator = require('gulp-html'),
gulp = require('gulp'), // Сообственно Gulp JS
sass = require('gulp-sass'), // Плагин для SASS
autoprefixer = require('gulp-autoprefixer'), // Autoprefixer
svgSprite = require("gulp-svg-sprites"), // SVG
livereload = require('gulp-livereload'), // Livereload для Gulp
csso = require('gulp-csso'), // Минификация CSS
imagemin = require('gulp-imagemin'), // Минификация изображений
uglify = require('gulp-uglify'), // Минификация JS
concat = require('gulp-concat'), // Склейка файлов
connect = require('gulp-connect'), // Webserver
server = lr();

gulp.task('html', function () {
  gulp.src('./assets/template/index.html')
    .pipe(connect.reload())
    .pipe(gulp.dest('./public/')) // записываем html
});

gulp.task('sass', function() {
	gulp.src('./assets/sass/**/*.scss')
	.pipe(sass())
	.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
	.pipe(gulp.dest('./public/css/')) // записываем css
	.pipe(connect.reload()) // даем команду на перезагрузку css
});

gulp.task('js', function() {
	gulp.src('./assets/js/**/*.js')
		.pipe(concat('index.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/vendor/**
		.pipe(gulp.dest('./public/js'))
		.pipe(connect.reload()) // даем команду на перезагрузку страницы
});

gulp.task('images', function() {
	gulp.src('./assets/img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./public/img'))
});

gulp.task('connect', function() {
  connect.server({
    root: 'public',
    livereload: true
  });
});

gulp.task('livereload', function (){
  gulp.src('./public/**/*')
  .pipe(connect.reload());
});

// Запуск сервера разработки gulp watch
gulp.task('watch', function() {
	// Предварительная сборка проекта
	gulp.run('html');
	gulp.run('sass');
	gulp.run('images');
	gulp.run('js');

	// Подключаем Livereload
	server.listen(9000, function() {

		gulp.watch('assets/sass/**/*.scss', function() {
			gulp.run('sass');
		});
		gulp.watch('assets/template/*.html', function() {
			gulp.run('html');
		});
		gulp.watch('assets/img/*', function() {
			gulp.run('images');
		});
		gulp.watch('assets/js/*.js', function() {
			gulp.run('js');
		});
	});
});

gulp.task('sprites', function () {
    return gulp.src('assets/img/*.svg')
        .pipe(svgSprite())
        .pipe(gulp.dest("./assets/img"));
});

gulp.task('default', ['connect', 'watch', 'sass']);

gulp.task('build', function() {
    // css
    gulp.src('./assets/sass/**/*.scss')
        .pipe(sass({
            use: ['nib']
        })) // собираем sass
    .pipe(csso()) // минимизируем css
    .pipe(gulp.dest('./build/css/')) // записываем css

    // jade
    gulp.src(['./assets/template/*.html', '!./assets/template/_*.html'])
        .pipe(gulp.dest('./build/'))

    // js
    gulp.src(['./assets/js/**/*.js', '!./assets/js/vendor/**/*.js'])
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));

    // image
    gulp.src('./assets/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'))
});
