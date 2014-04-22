var reactify = require('gulp-react'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    concat = require('gulp-concat'),
    through = require('through2'),
    gutil = require('gulp-util'),
    runSequence = require('run-sequence'),
    streamBuffers = require('stream-buffers'),
    gulp = require('gulp'),
    path = require('path');

function build(debug) {
  var pipeline = gulp.src('lib/**/*.js')
      .pipe(header('\nmodule = {};\n(function(require, module) {\n'))
      .pipe(footer('\n})(resolver, module);\nroot["<%- file.path.slice(0, -3).substring(file.path.indexOf("/lib/") + 5) %>"] = module.exports;\n'))
      .pipe(concat('react-semantic-ui.js'))
      .pipe(header('var rsui = (function() {\nfunction resolver(name) { return root[name.substring(name.indexOf("./") == 0 ? 2 : 0)] }\nvar root = {react: React}, module;\n'))
      .pipe(footer('\nreturn root;\n})();\n'))
      .pipe(gulp.dest('./'));
}

function _watch(debug) {
  gulp.src('./lib/*.js')
      .pipe(watch(function() {
        build(debug);
      }));
}

gulp.task('build', function() {
  build();
});

gulp.task('docs', function() {
  gulp.src('./lib/*.js')
    .pipe(docs)
    .pipe(gulp.dest('./docs'));
});

gulp.task('debug', function() {
  _watch(true);
});


var docs = through.obj(function(file, enc, cb) {
  var self = this;
  scanForDocs(file.contents, function(contents) {
    if (contents) {
      var index = file.path.indexOf('/lib'),
          base = file.path.substring(0, index),
          relative = file.path.substring(index + 4);
      for (var name in contents) {
        var _relative = relative.substr(0, relative.lastIndexOf(".")) + "/" + name + ".md";
 
        var _file = new gutil.File({
          cwd: file.cwd,
          base: file.base,
          path: path.join('docs', _relative),
          contents: new Buffer(contents[name])
        })
        self.push(_file);
      }
    }
    cb();
  });
});

function scanForDocs(buffer, cb) {
  var lines = buffer.toString('utf8').split('\n'),
      currentTitle,
      currentData,
      allDocs = {};

  function reset() {
    if (currentTitle) {
      allDocs[currentTitle] = currentData;
    }
    currentTitle = undefined;
    currentData = undefined;
  }

  for (var i=0; i<lines.length; i++) {
    var line = lines[i];
    if (!currentTitle) {
      if (line.indexOf('/***') >= 0) {
        currentTitle = line.replace(/^\s*\/\*\*\* /g, '');
      }
    } else {
      if (line.indexOf('***/') >= 0) {
        reset();
      } else {
        line = line.replace(/^\s*\*\s*$/, '');
        line = line.replace(/^\s*\* /, '');
        if (!currentData) {
          currentData = line;
        } else {
          currentData += ('\n' + line);
        }
      }
    }
  }

  reset();
  cb(createDocs(allDocs));
}

function createDocs(data) {
  for (var title in data) {
    var body = data[title],
        titleUnderline = '';
    while (titleUnderline.length < title.length) titleUnderline += '=';

    var content = title + '\n' + titleUnderline + '\n\n' + body;
    data[title] = content;
  }
  return data;
}

