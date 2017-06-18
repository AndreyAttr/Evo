console.log('--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
//Workaround: https://github.com/gowravshekar/bootstrap-webpack/issues/37#issuecomment-286517959
const extractCSS = new ExtractTextPlugin({filename: 'css/bootstrap_[name].css', allChunks: true})
    .extract({
            fallback: 'style-loader',
            use: [{loader: 'css-loader', options: {sourceMap: true}},
                {loader: 'less-loader', options: {sourceMap: true}}]
    });
var styleLoader = extractCSS.map( chunk => {
    const path = chunk.loader;
    if (chunk.options) {
        const options = JSON.stringify(chunk.options);
        console.log(`${path}?${options}`);
        return `${path}?${options}`;
    }
    console.log(path);
    return path;
}).join('!');
console.log('=======================================================================================');


module.exports = {
    //Fixme: Doesn't work: https://www.npmjs.com/package/bootstrap-webpack#extract-text-webpack-plugin
    //Done: Fixed with workaround
    styleLoader: styleLoader,
    //Remark: Any of these stuffs doesn't work - the only one solution I found - it's workaround
    // styleLoader: ExtractTextPlugin.extract({
    //     fallback: 'style-loader',
    //     use: ['css-loader', 'less-loader']
    // }),
    //styleLoader: extractCSS.extract({fallback: 'style-loader', use: ['css-loader', 'less-loader']}),
    //styleLoader: require('extract-text-webpack-plugin').extract({use: ['css-loader', 'less-loader']}),
    //styleLoader: require('extract-text-webpack-plugin').extract('style-loader', 'css-loader!less-loader'),

    scripts: {
        // add every bootstrap script you need
        'transition': true,
        'alert': true,
        'button': true,
        'carousel': true,
        'collapse': true,
        'dropdown': true,
        'modal': true,
        'tooltip': true,
        'popover': true,
        'scrollspy': true,
        'tab': true,
        'affix': true
    },
    styles: {
        // add every bootstrap style you need
        "mixins": true,

        "normalize": true,
        "print": true,

        "scaffolding": true,
        "type": true,
        "code": true,
        "grid": true,
        "tables": true,
        "forms": true,
        "buttons": true,

        "component-animations": true,
        "glyphicons": true,
        "dropdowns": true,
        "button-groups": true,
        "input-groups": true,
        "navs": true,
        "navbar": true,
        "breadcrumbs": true,
        "pagination": true,
        "pager": true,
        "labels": true,
        "badges": true,
        "jumbotron": true,
        "thumbnails": true,
        "alerts": true,
        "progress-bars": true,
        "media": true,
        "list-group": true,
        "panels": true,
        "wells": true,
        "close": true,

        "modals": true,
        "tooltip": true,
        "popovers": true,
        "carousel": true,

        "utilities": true,
        "responsive-utilities": true
    }
};