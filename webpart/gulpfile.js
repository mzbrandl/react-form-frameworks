const { src, dest, watch } = require('gulp');

function copyLocalizedResources() {
    return src('../container/src/webparts/**/loc/*.d.ts')
        .pipe(dest('./src/webparts'));
}

function triggerTargetWebPartReload() {
  return src('../container/src/index.ts')
      .pipe(dest('../container/src/'))
}

exports['copy-loc'] = copyLocalizedResources;

exports.watch = function () {
  watch('../container/src/webparts/**/loc/*.d.ts', {
      ignoreInitial: false
  }, copyLocalizedResources);

  watch('./dist/*.js', triggerTargetWebPartReload);
}
