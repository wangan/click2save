/// <binding Clean='clean' />

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    flatten = require("gulp-flatten"),
    uglify = require("gulp-uglify")

var paths = {
    root: "./",
    chrome: "./chrome/"
};

paths.js = paths.root + "js/**/*.js";
paths.minJs = paths.root + "js/**/*.min.js";
paths.css = paths.root + "css/**/*.css";
paths.minCss = paths.root + "css/**/*.min.css";
paths.concatJsDest = paths.root + "js/site.min.js";
paths.concatCssDest = paths.root + "css/site.min.css";
paths.commonLib_JS = paths.root + "bower_components/*/dist/**/*.min.js";
paths.commonLib_CSS = paths.root + "bower_components/*/dist/**/*.min.css";
paths.commonLib_Font = paths.root + "bower_components/*/dist/fonts/*.*";
paths.chrom_res = [
    paths.root + "manifest.json",
    paths.root + "image/Click2Save.png",
    paths.root + "css/**/*.*",
    paths.root + "fonts/**/*.*",
    paths.root + "html/**/*.*",
    paths.root + "js/**/*.*"
];


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
        .pipe(gulp.dest(paths.root + "js/"))
})

gulp.task("copy:css", function () {
    gulp.src(paths.commonLib_CSS)
        .pipe(flatten({ includeParents: [1, 0] }))
        .pipe(gulp.dest(paths.root + "css/"))
})

gulp.task("copy:fonts", function () {
    gulp.src(paths.commonLib_Font)
        .pipe(flatten({ includeParents: [0, 0] }))
        .pipe(gulp.dest(paths.root + "fonts/"))
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


gulp.task("pack:chrome", function () {
    gulp.src(paths.chrom_res, { base: "." })
        .pipe(flatten({ includeParents: [1, 1] }))
        .pipe(gulp.dest(paths.chrome))

});

gulp.task("pack", ["pack:chrome"]);
gulp.task("min", ["min:js", "min:css"]);
gulp.task("copy", ["copy:js", "copy:css", "copy:fonts"]);
