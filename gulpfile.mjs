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
import { existsSync } from "fs";

const babel = await import("gulp-babel").then((mod) => mod.default || mod);
const CacheBuster = await import("gulp-cachebust").then(
  (mod) => mod.default || mod
);
const cachebust = new CacheBuster();

const browserSync = browserSyncLib.create();
const sassCompiler = gulpSass(sass);

// ------------------------------------
// Build Mode (NODE_ENV 또는 환경 변수로 제어)
// ------------------------------------
const isProduction = process.env.NODE_ENV === "production" || process.env.BUILD_MODE === "production";

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
  // dev 모드에서는 imagemin 생략 (메모리 절약), 단순 복사
  if (!isProduction) {
    return src(paths.img.src, { encoding: false }).pipe(dest(paths.img.dest));
  }

  return src(paths.img.src, {
    encoding: false,
    buffer: true,
  })
    .pipe(
      imagemin(
        [
          imagemin.optipng({ optimizationLevel: 5 }),
          imagemin.svgo({
            plugins: [{ name: "removeViewBox", active: false }],
          }),
        ],
        { verbose: true }
      )
    )
    .pipe(dest(paths.img.dest));
}

// SCSS → CSS
function scss() {
  const postcssPlugins = [autoprefixer()];
  
  // 프로덕션 빌드에서만 CSS 압축
  if (isProduction) {
    postcssPlugins.push(
      cssnano({
        preset: ["default", { discardComments: { removeAll: true } }],
      })
    );
  }
  
  return (
    src([paths.scss.src, paths.scss.ignore])
      .pipe(
        sassCompiler({ quietDeps: true }).on("error", sassCompiler.logError)
      )
      .pipe(postcss(postcssPlugins))
      .pipe(dest(paths.scss.dest))
      .pipe(browserSync.stream())
  );
}

// CSS Library copy
function csscopy() {
  // lib 디렉토리가 없으면 빈 스트림 반환 (오류 방지)
  const libDir = "./markup/assets/css/lib";
  if (!existsSync(libDir)) {
    // 빈 스트림 반환 (완료된 Promise 반환)
    return new Promise((resolve) => {
      resolve();
    });
  }
  return src(paths.csscopy.src, { allowEmpty: true }).pipe(dest(paths.csscopy.dest));
}

// JS
function scripts() {
  let stream = src([paths.js.src, paths.js.ignore], { base: "./markup/assets/js" });
  
  // 프로덕션 빌드에서만 JavaScript 압축 및 최적화
  if (isProduction) {
    stream = stream
      .pipe(
        terser({
          compress: {
            drop_console: true, // console.log 제거
            drop_debugger: true, // debugger 제거
            pure_funcs: ["console.log", "console.info", "console.debug"], // 특정 함수 제거
          },
          format: {
            comments: false, // 주석 제거
          },
        })
      );
  }
  
  return stream
    .pipe(dest(paths.js.dest))
    .pipe(browserSync.stream());
}

// JS Library copy
function jscopy() {
  // lib 디렉토리가 없으면 빈 스트림 반환 (오류 방지)
  const libDir = "./markup/assets/js/lib";
  if (!existsSync(libDir)) {
    // 빈 스트림 반환 (완료된 Promise 반환)
    return new Promise((resolve) => {
      resolve();
    });
  }
  return src(paths.jscopy.src, { allowEmpty: true }).pipe(dest(paths.jscopy.dest));
}

// HTML SSI
function html() {
  let stream = src([paths.html.src, ...paths.html.ignore]) // 배열로 합침
    .pipe(
      includer({
        prefix: "@@", // include 구문: @@include("header.html")
        basepath: "./markup/html", // ✅ 기준 경로를 html 폴더 전체로 설정
      })
    );

  // dev 모드에서는 prettier 생략 (메모리 절약)
  if (isProduction) {
    stream = stream.pipe(prettier());
  }

  return stream
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
// ※ parallel 대신 series 사용: 9개 태스크 동시 실행 시 8GB+ 메모리 초과 → 순차 실행으로 피크 메모리 절감

const buildTasks = series(
  parallel(fonts, csscopy, jscopy, cdlindex, cdlfolder), // 가벼운 태스크 (병렬)
  images,
  scss,
  scripts,
  html,
);

// 프로덕션 빌드 (압축 및 최적화 포함)
const build = series(clean, buildTasks, cache);

// 개발 빌드 (압축 없음, 빠른 빌드)
const dev = series(clean, buildTasks, parallel(serve));

export { build, dev, clean };
export default dev;
