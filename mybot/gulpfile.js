var gulp = require('gulp');
var server = require('gulp-develop-server');
const db = require('./cassandraclt.js');
const twclt = require('./twitterclt.js');

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

gulp.task('initdb', function() {
    db.initDb();
});

gulp.task('collectweet', function() {
    twclt.collect('#ラーメン');
});