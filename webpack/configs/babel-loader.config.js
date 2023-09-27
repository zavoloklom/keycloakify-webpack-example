const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env) => {
    const isModeDevelopment = env === 'development';
    const isModeProduction = env === 'production';

    return {
        module: {
            rules: [
                // Process application JS with Babel.
                // The preset includes JSX, Flow, TypeScript, and some ESnext features.
                {
                  test: /\.(js|mjs|jsx|ts|tsx)$/,
                  include: path.resolve(__dirname, '../../src'),
                  loader: require.resolve('babel-loader'),
                  options: {
                    customize: require.resolve(
                      'babel-preset-react-app/webpack-overrides'
                    ),
                    presets: [
                      [
                        require.resolve('babel-preset-react-app'),
                        {
                            runtime: 'automatic',
                          //runtime: hasJsxRuntime ? 'automatic' : 'classic',
                        },
                      ],
                    ],

                    plugins: [
                      isModeDevelopment &&
                        require.resolve('react-refresh/babel'),
                    ].filter(Boolean),
                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: true,
                    // See #6846 for context on why cacheCompression is disabled
                    cacheCompression: false,
                    compact: isModeProduction,
                  },
                },
                // Process any JS outside of the app with Babel.
                // Unlike the application JS, we only compile the standard ES features.
                {
                    test: /\.(js|mjs)$/,
                    exclude: /@babel(?:\/|\\{1,2})runtime/,
                    loader: require.resolve('babel-loader'),
                    options: {
                        babelrc: false,
                        configFile: false,
                        compact: false,
                        presets: [
                            [
                                require.resolve('babel-preset-react-app/dependencies'),
                                { helpers: true },
                            ],
                        ],
                        cacheDirectory: true,
                        // See #6846 for context on why cacheCompression is disabled
                        cacheCompression: false,

                        // Babel sourcemaps are needed for debugging into node_modules
                        // code.  Without the options below, debuggers like VSCode
                        // show incorrect code and set breakpoints on the wrong lines.
                        sourceMaps: false,
                        inputSourceMap: false,
                    },
                },
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
