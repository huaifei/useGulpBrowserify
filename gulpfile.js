var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    gutil = require('gulp-util'),
    reactify = require('reactify'),
    watchify = require('watchify'),
    notify = require("gulp-notify"),
    sass = require("gulp-sass"),
    $ = require('gulp-load-plugins')({ lazy: true }),
    sourcemaps = require('gulp-sourcemaps');

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

gulp.task('default',function () {
    gulp.start('watch');
    gulp.watch('./app/sass/**/*.scss',['styles']);
});

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
        bundler = watchify(bundler); // only watch main.js TODO:watch the whole app directory
        bundler.on('update', bundleFunc);
    }

    return bundleFunc();

});

gulp.task('styles', function() {

    gutil.log($.util.colors.magenta('--SASS/CSS building...--'));
    gulp.src('./app/sass/index.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./app/css/'))

});


function handleErrors() {

    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
    }).apply(this, args);
    this.emit('end');
    // Keep gulp from hanging on this task
}


function buildScript(file, watch) {
    var props = {entries: []};
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

