const mix = require("laravel-mix");
var LiveReloadPlugin = require("webpack-livereload-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js("resources/js/app.js", "public/js")
    .react()
    .sass("resources/sass/app.scss", "public/css");
mix.options({
    legacyNodePolyfills: false,
});
mix.webpackConfig({
    plugins: [new NodePolyfillPlugin()],
    module: {
        rules: [
            {
                test: /\.mp4$/i,
                use: [
                    {
                        loader: "file-loader",
                    },
                ],
            },
        ],
    },
});
