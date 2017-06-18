/// <reference path="typings/global.d.ts" />
/// <reference path="typings/webpack.d.ts" />

import Common from "./webpack.common.config";
const { HotModuleReplacementPlugin, NamedModulesPlugin, ProvidePlugin } = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
const webpackMerge = require('webpack-merge');
import helper = require('./helpers/path.helper');
//let Common = require(helper.webpackConfig('webpack.common.config'));


module.exports = function webpackDevConfig(options: EnvOptions = {}): IWebpackConfig{
    const common = new Common(options);
    return webpackMerge(common.Configuration, {
        //cache: true,                                  //TODO: need or not?

        //devtool: "cheap-eval-source-map", //For HMR - https://github.com/webpack/webpack/issues/2478#issuecomment-220205767  //https://webpack.js.org/configuration/devtool/     https://webpack.js.org/guides/development/
        //https://webpack.js.org/configuration/devtool/#devtool
        devtool: 'cheap-module-eval-source-map',
        //cheap-eval-source-map                           - transformed code (lines only) ---  transpiled JS files
        //eval-source-map, cheap-module-eval-source-map   - original source --- TS files

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use:
                        [].concat(common.Metadata.HMR ? {loader: '@angularclass/hmr-loader'} : [])   //to turn on HMR for TS/HTML templates when using Angular2
                            .concat([
                            {
                                loader: 'awesome-typescript-loader',        //https://www.npmjs.com/package/shmawesome-typescript-loader
                                // options: {
                                //     configFileName: helper.root('1_tsconfig.json'),
                                //     tsconfig: helper.root('2_tsconfig.json')             //TODO: doesn't work - https://www.npmjs.com/package/shmawesome-typescript-loader
                                // }
                            }
                        ]),
                    exclude: [
                        helper.root("node_modules"),
                    ]
                }]
        },

        plugins: [
            new NamedModulesPlugin(),            // prints more readable module names in the browser console on HMR updates
            new WebpackNotifierPlugin({ //to notify about webpack has finished bundling
                //excludeWarnings: true,
                title: "Webpack Notifier Plugin message",
                contentImage: helper.root('wwwroot/images/warning.png'),
                message: "Wow, Build Successful!",
                alwaysNotify: true,             //cause double notification
                //skipFirstNotification: true
            }),

            //https://github.com/AngularClass/angular2-webpack-starter/issues/696#issuecomment-226442566
            // new ProvidePlugin({     //automatically loads modules
            //     $: 'jquery',
            //     jQuery: 'jquery',
            //     'window.jQuery': 'jquery',
            //     'window.$': 'jquery'
            // })
        ].concat(common.Metadata.HMR ? new HotModuleReplacementPlugin() : []),     // enable HMR

        //https://webpack.js.org/configuration/dev-server
        devServer: {
            //contentBase: path.join(__dirname, "wwwroot/dist"), //for static files - what directory(ies) web-dev-server will looking at file changes and if that changes happens it will recompile whole BUNDLE
            publicPath: common.Configuration.output.publicPath,  //to let webpack-dev-server to know what URL should be used to display BUNDLE file: http://localhost:9001/bundle/web/page1.bundle.js - /web/ because we add folder for that
            host: JSON.parse(common.Metadata.HOST),            //TODO: according to using JSON.stringify in common need do replacement here to avoid error
            port: common.Metadata.PORT,
            staticOptions: {},              //It is possible to configure advanced options for serving static files from contentBase
            stats: {                        //This option lets you precisely control what bundle information gets displayed. This can be a nice middle ground if you want some bundle information, but not all of it.
                colors: true                //`webpack --colors` equivalent - https://webpack.js.org/configuration/stats/
            },
            compress: false,                    //Enable gzip compression for everything served
            historyApiFallback: true,
            https: common.Metadata.HTTPS,              //By default dev-server will be served over HTTP
            //public:'0.0.0.0:9001',
            inline: common.Metadata.HMR,     //by default       //TODO: is it really depends on HMR?
            hot: common.Metadata.HMR         //enable HMR on the server - 'hot: true'  doesn't allow PAGE to reload automatically when changes was done in *.ts files. Instead of this it load only pieces of changed *.ts files to browser
            //quiet: false
        },
        //watch: true,    //https://webpack.js.org/configuration/watch/#watch
        //externals: [nodeExternals({ whitelist: [allFilenamesExceptJavaScript] })], // Don't bundle .js files from node_modules
    });
}