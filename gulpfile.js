/// <binding Clean='clean' />

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    flatten = require("gulp-flatten"),
    uglify = require("gulp-uglify")

var paths = {
    webroot: "./"
};

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";
paths.commonLib_JS = paths.webroot + "bower_components/*/dist/**/*.min.js";
paths.commonLib_CSS = paths.webroot + "bower_components/*/dist/**/*.min.css";
paths.commonLib_Font = paths.webroot + "bower_components/*/dist/fonts/*.*";

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("copy:js", function () {
    gulp.src(paths.commonLib_JS)
        .pipe(flatten({ includeParents: [1, 0] }))
        .pipe(gulp.dest(paths.webroot + "js/"))
})

gulp.task("copy:css", function () {
    gulp.src(paths.commonLib_CSS)
        .pipe(flatten({ includeParents: [1, 0] }))
        .pipe(gulp.dest(paths.webroot + "css/"))
})

gulp.task("copy:fonts", function () {
    gulp.src(paths.commonLib_Font)
        .pipe(flatten({ includeParents: [0, 0] }))
        .pipe(gulp.dest(paths.webroot + "fonts/"))
})

gulp.task("min:js", function () {
    gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css"]);
gulp.task("copy", ["copy:js", "copy:css", "copy:fonts"]);
