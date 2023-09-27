const path = require('path');
const fs = require('fs-extra');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EventHooksPlugin = require("event-hooks-webpack-plugin");

const buildFolder = path.resolve(__dirname, `../../build`);
const publicFolder = path.resolve(__dirname, `../../public`);
const htmlIndexFile = path.resolve(__dirname, `../../public/index.html`);

module.exports = (env) => {
    const isEnvProduction = env === 'production';

    return {
        entry: path.resolve(__dirname, '../../src/index.tsx'),
        output: {
            publicPath: '/',
            path: buildFolder,
            filename: `static/js/[name].[contenthash:8].js`,
            chunkFilename: `static/js/[name].[contenthash:8].chunk.js`,
            assetModuleFilename: `static/[name].[hash][ext]`,
            clean: true,
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    options: {
                        // Handle JSX transform
                        presets: [
                            [
                                require.resolve('babel-preset-react-app'),
                                {
                                    runtime: 'automatic',
                                },
                            ],
                        ],
                    },
                },
                {
                    test: /\.css$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                    ],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|md)$/i,
                    type: 'asset/resource',
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: htmlIndexFile,
                inject: true,
                templateParameters: {
                    PUBLIC_URL: '/',
                },
            }),
            new EventHooksPlugin({
                done: () => {
                    fs.copySync(publicFolder, buildFolder, {
                        dereference: true,
                        filter: file => file !== htmlIndexFile,
                    });
                }
            }),
        ],
        optimization: {
            minimize: isEnvProduction,
        },
    }
};
