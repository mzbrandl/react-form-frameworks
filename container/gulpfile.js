'use strict';
const gulp = require('gulp');

const build = require('@microsoft/sp-build-web');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    includeRuleForSourceMapLoader(generatedConfiguration.module.rules);
    return generatedConfiguration;
  }
})

const externalsFolder = "webpart";

const copyStaticFilesSubtask = build.subTask('copy-static-files', function (gulp, buildOptions, done) {
  this.log('Copying static files...');

  gulp.src(`../${externalsFolder}/dist/*.{png,jpg,svg,gif,woff,eot,ttf}`)
    .pipe(gulp.dest("./dist"))
    .pipe(gulp.dest("./temp/deploy"));

  done();
});

build.rig.addPostBuildTask(copyStaticFilesSubtask);

build.initialize(gulp);

function includeRuleForSourceMapLoader(rules) {
  for (const rule of rules) {
    if (rule.use && typeof rule.use === 'string' && rule.use.indexOf('source-map-loader') !== -1) {
      rule.use = rule.use.replace("@microsoft\\sp-build-core-tasks\\node_modules\\", '');
    }
  }
}