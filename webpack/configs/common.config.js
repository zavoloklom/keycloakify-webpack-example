const webpack = require('webpack');
const path = require('path');
const fs = require("fs-extra");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const EventHooksPlugin = require("event-hooks-webpack-plugin");

require('dotenv').config();

const buildFolder = path.resolve(__dirname, `../../build`);
const publicFolder = path.resolve(__dirname, `../../public`);
const htmlIndexFile = path.resolve(__dirname, `../../public/index.html`);
const assetsFolderName = 'static';

module.exports = (env) => {
    const isEnvDevelopment = env === 'development';
    const isModeProduction = env === 'production';

    return {
        entry: path.resolve(__dirname, '../../src/index.tsx'),
        devtool: isEnvDevelopment ? 'inline-source-map' : false,
        devServer: {
            port: 3000,
            historyApiFallback: true,
            hot: true,
            client: {
                overlay: false,
            },
        },
        output: {
            publicPath: '/',
            path: buildFolder,
            filename: `${assetsFolderName}/js/[name].[contenthash:8].js`,
            chunkFilename: `${assetsFolderName}/js/[name].[contenthash:8].chunk.js`,
            assetModuleFilename: `${assetsFolderName}/[name].[hash][ext]`,
            clean: true,
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.png', '.svg'],
            symlinks: true,
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [
                        isEnvDevelopment && 'style-loader',
                        isModeProduction && {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        'postcss-flexbugs-fixes',
                                        [
                                            'postcss-preset-env',
                                            {
                                                /* use stage 3 features */
                                                stage: 3,
                                                autoprefixer: {
                                                    flexbox: 'no-2009', // May break the layout on mobile devices.
                                                },
                                            },
                                        ],
                                    ],
                                    sourceMap: isEnvDevelopment,
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.svg$/i,
                    issuer: /\.([jt]sx|md|mdx)?$/,
                    use: [
                        {
                            loader: '@svgr/webpack',
                            options: {
                                prettier: false,
                                svgo: false,
                                svgoConfig: {
                                    plugins: [{ removeViewBox: false }],
                                },
                                titleProp: true,
                                ref: true,
                            },
                        },
                        {
                            loader: 'file-loader',
                            options: {
                                name: `${assetsFolderName}/media/[name].[hash].[ext][query]`,
                            },
                        },
                    ],
                },
                {
                    test: /\.svg$/i,
                    issuer: /\.s?css$/,
                    type: 'asset/resource',
                    generator: {
                        filename: `${assetsFolderName}/media/[name].[hash][ext][query]`,
                    },
                },
                {
                    test: /\.(png|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: `${assetsFolderName}/media/[name].[hash][ext][query]`,
                    },
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name][ext][query]',
                    },
                },
                {
                    test: /\.(md|mdx)$/i,
                    type: 'asset/resource',
                },
            ],
        },
        plugins: [
            new Dotenv(),
            new MiniCssExtractPlugin({
                filename: `${assetsFolderName}/css/[name].css`,
            }),
            new HtmlWebpackPlugin({
                template: htmlIndexFile,
                inject: true,
                templateParameters: {
                    PUBLIC_URL: process.env.PUBLIC_URL || '/',
                },
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                },
            }),
            // To copy files from public folder except index.html (or you can use CopyWebpackPlugin)
            new EventHooksPlugin({
                done: (compilation, done) => {
                    fs.copySync(publicFolder, buildFolder, {
                        dereference: true,
                        filter: file => file !== htmlIndexFile,
                    });
                }
            }),
            new ForkTsCheckerWebpackPlugin({
                async: isEnvDevelopment
            }),
            new webpack.ProgressPlugin({
                activeModules: false,
                entries: true,
                modules: true,
                modulesCount: 5000,
                profile: false,
                dependencies: true,
                dependenciesCount: 10000,
                percentBy: null,
            }),
        ],
        optimization: {
            minimize: isModeProduction,
            minimizer: [
                new CssMinimizerPlugin(),
            ],
        },
    };
};
