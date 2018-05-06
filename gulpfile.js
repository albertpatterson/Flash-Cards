const gulp = require('gulp');
const del = require('del');

gulp.task('clean', function(){
    return del.sync([
        'dist/**',
        '!dist'
      ]);
})

gulp.task('copy-src', ['clean'], function(){
    gulp.src('src/**/*.*')
    .pipe(gulp.dest('dist'))
})


const defaultTasks = ['copy-src'];

gulp.task('watch', function(){
    return gulp.watch('src/**/*.*', defaultTasks);
})

gulp.task('default', defaultTasks);