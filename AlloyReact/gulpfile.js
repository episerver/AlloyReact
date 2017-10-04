/// <binding ProjectOpened='webpack' />
//"use strict";

const gulp = require("gulp"),
      util = require("gulp-util"),
      webpack = require("webpack"),
      webpackConfig = require("./webpack.config");;

gulp.task('webpack', function (callback) {
    var config = Object.create(webpackConfig);

    config.plugins = [
          new webpack.optimize.UglifyJsPlugin({ sourceMap: true })
    ];

    webpack(config, function (err, stats) {
        if (err) {
            throw new util.PluginError('webpack', err)
        }

        util.log('[webpack]', stats.toString({
            colors: true,
            progress: true,
            errorDetails: true
        }));
    });
});