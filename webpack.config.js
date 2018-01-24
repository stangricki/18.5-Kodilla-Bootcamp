const webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
    OptimizeJsPlugin = require('optimize-js-plugin'),
    path = require('path'),

    env = process.env.NODE_ENV || 'development',


    plugins = [new HtmlWebpackPlugin({
        template: './src/index.htm',
        filename: 'index.html',
        inject: 'body'
        })
    ];


console.log('NODE_ENV:', env);

if (env === 'production') {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin(),
        new OptimizeJsPlugin({
            sourceMap: false
        })
    );
} else {
    plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = {
    entry: (env !== 'production' ? [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/dev-server',
    ] : []).concat(['./client/index.js']),

    output: {
        filename: './bundle.js',
        path: path.resolve(__dirname, 'public')
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: __dirname + '/node_modules'
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                ]
            }
        ]
    },

    devServer: {
        hot: true,
        contentBase: './client'
    },

    plugins: plugins
};
