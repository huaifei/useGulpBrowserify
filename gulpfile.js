var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    gutil = require('gulp-util'),
    reactify = require('reactify'),
    watchify = require('watchify'),
    notify = require("gulp-notify");


// gulp.task('default',function(){
//     gulp.start('bundle');
// });

// gulp.task('bundle', function() {
//     return browserify('./app/js/main.js')
//         .bundle()
//         .pipe(source('bundle.js'))
//         .pipe(gulp.dest('./'));
// });

gulp.task('build', function() {
    return buildScript('./app/js/main.js', false);
});

gulp.task('default', ['build'], function() {
    return buildScript('./app/js/main.js', true);
});

function buildScript(file, watch) {
    var props = {entries: [file]};
    var bundler = watch ? watchify(props) : browserify(props);
    bundler.transform(reactify);

    function rebundle() {
        var stream = bundler.bundle({debug: true});
        return stream.on('error', handleErrors)
            .pipe(source(file))
            .pipe(gulp.dest(buildDir + '/'));
    }

    bundler.on('update', function() {
        rebundle();
        gutil.log('Rebundle...');
    });
    return rebundle();
}

function handleErrors() {

    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
    }).apply(this, args);
    this.emit('end');
    // Keep gulp from hanging on this task
}

// gulp.task('stream', function (){
//     return watch('./app/**/*.*',bundle);
// });

// function bundle(){
//     return browserify('./app/js/main.js')
//         .bundle()
//         .pipe(source('bundle.js'))
//         .pipe(gulp.dest('./'));
// }