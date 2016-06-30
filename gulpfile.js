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


//-----------------------------------------------

var global = {
    isWatching: true
};

gulp.task('watch',function () {
    var bundler = browserify('./app/js/main.js');
    // var watchedfiles = browserify('./app/js/*.js');
    
    var bundleFunc = function () {
        return bundler.bundle()
            .on('error', handleErrors)
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('./'));
    };

    if(global.isWatching) {
        bundler = watchify(bundler);
        bundler.on('update', bundleFunc);
    }

    return bundleFunc();

});


gulp.task('default',function () {
    gulp.start('watch');
});

// gulp.task('browserify', watchify(function(watchify) {
//     return gulp.src(bundlePaths.src)
//         .pipe(watchify({
//             watch:watching
//         }))
//         .pipe(gulp.dest(bundlePaths.dest))
// }));


//-----------------------------------------------


// gulp.task('build', function() {
//     return buildScript('./app/js/main.js', false);
// });
//
// gulp.task('default', ['build'], function() {
//     return buildScript('./app/js/main.js', true);
// });


function buildScript(file, watch) {
    var props = {entries: [file]};
    var bundler = watch ? watchify(props) : browserify(props);
    // bundler.transform(reactify);

    function rebundle() {
        var stream = bundler.bundle();
        return stream.on('error', handleErrors)
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('./'));
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

//-----------------------------------------------

// gulp.task('stream', function (){
//     return watch('./app/**/*.*',bundle);
// });

// function bundle(){
//     return browserify('./app/js/main.js')
//         .bundle()
//         .pipe(source('bundle.js'))
//         .pipe(gulp.dest('./'));
// }

