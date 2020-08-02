const gulp            = require('gulp'),
      //nunjucksRender  = require('gulp-nunjucks-render'),
      sass            = require('gulp-sass'),
      browserSync   	= require('browser-sync').create(),
      cleanCSS 		    = require('gulp-clean-css'),
      sourcemaps 	  	= require('gulp-sourcemaps'),
		  autoprefixer 	  = require('gulp-autoprefixer'),
	  	babel 		    	= require('gulp-babel'),
      //uglify 		    	= require('gulp-uglify'),
      rename          = require('gulp-rename');


const sourceSCSS     	= 'src/assets/**/*.scss',
      //sourceNJK     	= 'src/html/*.njk',
      sourceJS      	= 'src/assets/**/*.js',
      distPath        = 'dist/assets/';


// nunjucks template
// gulp.task('nunjucks', () => {
//   return gulp.src(sourceNJK)   
//     .pipe(nunjucksRender({
//       path: ['src/templates/']
//     }))
//     .pipe(gulp.dest('dist'));
// });

// scss
gulp.task('sass', (done) => {
     gulp.src(sourceSCSS)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expand'}).on('error', sass.logError))
        .pipe(autoprefixer({
          cascade: true
        }))
        .pipe(cleanCSS()) //minify
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('/'))        
        .pipe(gulp.dest(distPath))
        .pipe(browserSync.reload({stream: true}));

        done();
});

// js
gulp.task('babel', () =>
  gulp.src(sourceJS)
	.pipe(babel({
		presets: ['@babel/env']
	}))
  // .pipe(uglify()) //minify
  .pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(distPath))
);

gulp.task('js-watch', gulp.series('babel', (done) => {
  browserSync.reload();
  done();
}));


gulp.task('browser-sync', (done) => { 
  browserSync.init({
      server: {
          baseDir: 'dist/'
      },
      notify: false 
  });
browserSync.watch('dist/').on('change', browserSync.reload); 

done()
});	

// watcher
//gulp.task('watch', gulp.series('nunjucks', 'sass', 'babel', 'browser-sync', (done) => {
gulp.task('watch', gulp.series('sass', 'babel', 'browser-sync', (done) => {
//gulp.watch(sourceNJK, gulp.series('nunjucks'));
  gulp.watch(sourceSCSS, gulp.series('sass'));
  gulp.watch(sourceJS, gulp.series('js-watch'));

  done()
}));

gulp.task('default', gulp.task('watch'));