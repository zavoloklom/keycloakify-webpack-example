const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env) => {
    const isModeDevelopment = env === 'development';
    const isModeProduction = env === 'production';

    return {
        module: {
            rules: [
                {
                    test: /\.(tsx|ts)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                            },
                        },
                    ],
                }
            ],
        },
        optimization: {
            minimizer: [
                // Copy from RCA
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        // keep_classnames: isEnvProductionProfile,
                        // keep_fnames: isEnvProductionProfile,
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true,
                        },
                    },
                }),
            ],
        },
    }
};
