import gulp from "gulp";
import gpug from "gulp-pug";
import gimage from "gulp-image";
import gsass from "gulp-sass";
import nsass from "node-sass";
import { deleteAsync } from "del";
import autoPrefixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";
import gbro from "gulp-bro";
import babelify from "babelify";
import ws from "gulp-webserver";

const sass = gsass(nsass);


const routes = {
    pug: {
        watch: "src/views/**/*.pug",
        src: "src/views/*.pug",
        dest: "build"
    },
    scss: {
        watch: "src/scss/**/*.scss",
        src: "src/scss/styles.scss",
        dest: "build/css"
    },
    img: {
        src: "src/img/*",
        dest: "build/img"
    },
    js: {
        watch: "src/js/**/*.js",
        src: "src/js/main.js",
        dest: "build/js"
    }
}

//pug not used yet
const pug = () => 
    gulp
        .src(routes.pug.src)
        .pipe(gpug())
        .pipe(gulp.dest(routes.pug.dest));

const img = () =>
    gulp
        .src(routes.img.src)
        .pipe(gimage())
        .pipe(gulp.dest(routes.img.dest));

const styles = () =>
    gulp
        .src(routes.scss.src)
        .pipe(sass().on("error", sass.logError))
        .pipe(autoPrefixer())
        .pipe(miniCSS())
        .pipe(gulp.dest(routes.scss.dest));

const js = () =>
    gulp
        .src(routes.js.src)
        .pipe(gbro({
            transform: [
                babelify.configure({ presets: ['@babel/preset-env']}),
                [ 'uglifyify', { global: true } ]
            ]
        }))
        .pipe(gulp.dest(routes.js.dest));

const clean = () => deleteAsync(["build"]);

const webserver = () => 
    gulp
    .src("build")
    .pipe(ws({ livereload: true, open: true}))

const watch = () => {
    //gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.img.src, img);
    gulp.watch(routes.scss.watch, styles);
    gulp.watch(routes.js.watch, js);
}

const prepare = gulp.series([clean, img]);

const assets = gulp.series([styles, js]);

const postDev = gulp.parallel([watch]);

export const dev = gulp.series([prepare, assets, postDev]);