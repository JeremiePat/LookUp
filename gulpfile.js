const path = require('path')
const { Transform } = require('stream')

const del = require('delete')
const zip = require('gulp-zip')
const sass = require('sass')
const imagemin = require('gulp-imagemin')
const beautify = require('gulp-beautify')
const nunjucks = require('gulp-nunjucks')
const { src, dest, series, parallel } = require('gulp')

const { version, dependencies } = require(path.join(__dirname, 'package.json'))

// Clear addon folder
function clear () {
  return del.promise(['addon'])
}

// Clean up and optimize images
function images () {
  return src('src/**/*.{png,jpg,jpeg,gif,svg}')
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        // https://github.com/svg/svgo#what-it-can-do
        plugins: [
          { cleanupIDs: false },
          { convertShapeToPath: false },
          { convertStyleToAttrs: false },
          { inlineStyles: false },
          { removeDimensions: true },
          // { removeEmptyAttrs: false },
          // { removeEmptyContainers: false },
          // { removeEmptyText: false },
          // { removeHiddenElems: false },
          // { removeUnknownsAndDefaults: false },
          { removeViewBox: false }
        ]
      })
    ]))
    .pipe(dest('addon'))
}

// Copy files that require no transformation
function copy () {
  return src('src/**/*.{js,json}')
    .pipe(dest('addon'))
}

function vendor () {
  const dep = Object
    .keys(dependencies)
    .map(name => {
      const dir = path.join(__dirname, 'node_modules', name)
      const { browser, main } = require(path.join(dir, 'package.json'))

      return path.join(dir, browser || main)
    })

  return src(dep)
    .pipe(dest('addon/js/vendor'))
}

// Compile HTML templates
function html () {
  return src('src/**/*.html')
    .pipe(nunjucks.compile())
    .pipe(beautify.html({ indent_size: 2 }))
    .pipe(dest('addon'))
}

// Compile SCSS files
function scss () {
  return src([
    'src/**/*.scss',
    '!src/**/_*.scss',
    '!src/_**/*.scss'
  ])
    .pipe(new Transform({
      objectMode: true,
      transform (obj, _, cb) {
        const result = sass.renderSync({
          file: obj.path
        })

        obj.contents = result.css
        obj.extname = '.css'
        cb(null, obj)
      }
    }))
    .pipe(beautify.css({ indent_size: 2 }))
    .pipe(dest('addon'))
}

// Pack the extension into a zip file
function pack () {
  return src('addon/*')
    .pipe(zip(`lookup.${version}.zip`))
    .pipe(dest('.'))
}

const build = parallel(vendor, copy, images, html, scss)
const make = series(build, pack, clear)

// Expose pipelines
exports.build = build
exports.clear = clear
exports.pack = pack
exports.make = make
