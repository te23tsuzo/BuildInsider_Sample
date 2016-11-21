var gulp = require('gulp');
var server = require('gulp-develop-server');

gulp.task('start', function() {
    server.listen( {path: './index.js'})
});

gulp.task('restart', function() {
    gulp.watch(['./index.js'], server.restart(function() {
        echo('restrt server.')
    }));
});

gulp.task('stop', function() {
    server.kill;
});

