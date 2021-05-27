const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");


module.exports = {
    entry: {
        main: path.resolve(__dirname, './src/index.js'),
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, './dist'),
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    plugins: [
        new MiniCssExtractPlugin(
    //         {
    //     filename: "[name].css"
    // }
    ),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, './src/auth.html'),
        }),
        // new CleanWebpackPlugin(),
    ],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            // {
            //     test: /\.css$/,
            //     use: [
            //         'style-loader',
            //         {
            //             loader: 'css-loader',
            //             options: {
            //                 importLoaders: 1,
            //                 modules: true
            //             }
            //         }
            //     ],
            //     // include: /\.module\.css$/
            // },
            // { test: /\.txt$/, use: 'raw-loader' },


            // {
            //     test: /\.css$/,
            //     use: [
            //         'style-loader',
            //         'css-loader',
            //     ]
            // },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     use: ['babel-loader'],
            // },
        ],
    },
    resolveLoader: {
        modules: [
            path.join(__dirname, 'node_modules')
        ]
    },
    resolve: {
        descriptionFiles: ['package.json'],
        enforceExtension: false,
        aliasFields: ['browser'],
        mainFiles: ['index'],
        modules: [
            path.join(__dirname, 'node_modules')
        ],
        plugins: [new DirectoryNamedWebpackPlugin()],
        preferRelative: true,

    },
};