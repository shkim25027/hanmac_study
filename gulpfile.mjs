// gulpfile.mjs
import gulp, { src, dest, watch, series, parallel } from "gulp";
import gulpSass from "gulp-sass"; //SCSS → CSS 컴파일
import * as sass from "sass";
import postcss from "gulp-postcss"; //CSS 후처리, 플러그인 적용
import autoprefixer from "autoprefixer"; //브라우저 벤더 프리픽스 자동 추가
import cssnano from "cssnano"; //CSS 최소화 (minify) SCSS → CSS 후 종합 최적화(PostCSS 필요)
import browserSyncLib from "browser-sync"; // 개발 서버를 띄우고 파일 변경 시 브라우저 자동 새로고침
import concat from "gulp-concat"; //여러 파일을 하나로 합침
import rename from "gulp-rename"; //파일 이름 변경 (예: style.css → style.min.css)
import terser from "gulp-terser"; //JS 압축/최적화
import imagemin from "gulp-imagemin"; //PNG, JPEG, GIF, SVG 이미지 용량 최적화
import includer from "gulp-file-include"; //Gulp 빌드 시 정적 HTML 조립
import prettier from "gulp-prettier"; //JS/CSS/HTML 코드 자동 포맷팅
import { deleteAsync } from "del";

const babel = await import("gulp-babel").then((mod) => mod.default || mod);
const CacheBuster = await import("gulp-cachebust").then(
  (mod) => mod.default || mod
);
const cachebust = new CacheBuster();

const browserSync = browserSyncLib.create();
const sassCompiler = gulpSass(sass);

// ------------------------------------
// Paths
// ------------------------------------
const paths = {
  build: "./dist/",
  scss: {
    src: "./markup/assets/css/scss/**/*.scss",
    ignore: "!./markup/assets/css/scss/import",
    dest: "./dist/assets/css",
  },
  csscopy: {
    src: "./markup/assets/css/lib/**/*",
    dest: "./dist/assets/css/lib",
  },
  js: {
    src: "./markup/assets/js/**/*.js",
    ignore: "!./markup/assets/js/lib",
    dest: "./dist/assets/js",
  },
  jscopy: { src: "./markup/assets/js/lib/**/*", dest: "./dist/assets/js/lib" },
  img: {
    src: "./markup/assets/images/**/*.{png,jpg,jpeg,svg}",
    dest: "./dist/assets/images",
  },
  fonts: { src: "./markup/assets/fonts/**/*", dest: "./dist/assets/fonts" },
  html: {
    src: "./markup/html/**/*.html",
    // ignore: "!./markup/html/_include",
    ignore: [
      "!./markup/html/_include/", // include 폴더 제외
      "!./markup/html/_sub/", // sub 폴더 제외
    ],
    dest: "./dist",
  },
  cdl: {
    index: {
      src: "./markup/coding_list.html",
      dest: "./dist",
    },
    folder: {
      src: "./markup/_coding_list/**/*",
      dest: "./dist/_coding_list",
    },
  },
};

// ------------------------------------
// Tasks
// ------------------------------------

// Clean dist
async function clean() {
  return deleteAsync([paths.build + "**/*"], { force: true });
}

// Fonts
function fonts() {
  return src(paths.fonts.src).pipe(dest(paths.fonts.dest));
}

// Images
function images() {
  return src(paths.img.src, {
    encoding: false,
    buffer: true,
  })
    .pipe(
      imagemin(
        [
          //0: 최적화 안 함 (빠름, 용량 큰 편)
          //3: 적당한 최적화 (속도와 용량 균형) ✅ 권장
          //5: 기본값 (더 작은 용량, 좀 더 느림)
          //7: 최대 최적화 (가장 작은 용량, 매우 느림)
          imagemin.optipng({ optimizationLevel: 3 }), // 5 대신 3으로 낮춤
          imagemin.svgo({
            plugins: [{ name: "removeViewBox", active: false }],
          }),
        ],

        {
          verbose: true, // 로그 출력
        }
      )
    )
    .pipe(dest(paths.img.dest));
  //return src(paths.img.src).pipe(imagemin()).pipe(dest(paths.img.dest));
  // return src(paths.img.src).pipe(dest(paths.img.dest));
}

// SCSS → CSS
function scss() {
  return (
    src([paths.scss.src, paths.scss.ignore])
      .pipe(
        sassCompiler({ quietDeps: true }).on("error", sassCompiler.logError)
      )
      .pipe(postcss([autoprefixer()])) // 압축 안됨
      //.pipe(postcss([autoprefixer(), cssnano()]))  // 압축
      //.pipe(rename({ suffix: ".min" }))
      .pipe(dest(paths.scss.dest))
      .pipe(browserSync.stream())
  );
}

// CSS Library copy
function csscopy() {
  return src(paths.csscopy.src).pipe(dest(paths.csscopy.dest));
}

// JS
function scripts() {
  return (
    src([paths.js.src, paths.js.ignore])
      // .pipe(concat("common.js"))
      //.pipe(babel({ presets: ["@babel/preset-env"] }))
      //.pipe(terser())
      // .pipe(rename({ suffix: ".min" }))
      .pipe(dest(paths.js.dest))
      .pipe(browserSync.stream())
  );
}

// JS Library copy
function jscopy() {
  return src(paths.jscopy.src).pipe(dest(paths.jscopy.dest));
}

// HTML SSI
function html() {
  return src([paths.html.src, ...paths.html.ignore]) // 배열로 합침
    .pipe(
      includer({
        prefix: "@@", // include 구문: @@include("header.html")
        basepath: "./markup/html", // ✅ 기준 경로를 html 폴더 전체로 설정
      })
    )
    .pipe(prettier())
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// Cache bust
function cache() {
  return src(`${paths.html.dest}/**/*.html`)
    .pipe(cachebust.references())
    .pipe(dest(paths.html.dest));
}

function cdlindex() {
  return src(paths.cdl.index.src).pipe(dest(paths.cdl.index.dest));
}

function cdlfolder() {
  return src(paths.cdl.folder.src).pipe(dest(paths.cdl.folder.dest));
}
// BrowserSync
function serve() {
  browserSync.init({
    server: { baseDir: paths.build, index: "/coding_list.html" },
    port: 3000,
  });
  watch(paths.scss.src, scss);
  watch(paths.csscopy.src, csscopy);
  watch(paths.js.src, scripts);
  watch(paths.jscopy.src, jscopy);
  watch(paths.img.src, images);
  watch(paths.fonts.src, fonts);
  watch(paths.html.src, html);
  watch(paths.cdl.index.src, cdlindex);
  watch(paths.cdl.folder.src, cdlfolder);
}

// ------------------------------------
// Series / Parallel Tasks
// ------------------------------------

const build = series(
  clean,
  parallel(
    fonts,
    images,
    scss,
    csscopy,
    scripts,
    jscopy,
    html,
    cdlindex,
    cdlfolder
  ),
  cache
);

const dev = series(
  clean,
  parallel(
    fonts,
    images,
    scss,
    csscopy,
    scripts,
    jscopy,
    html,
    cdlindex,
    cdlfolder
  ),
  parallel(serve)
);

export { build, dev, clean };
export default dev;
