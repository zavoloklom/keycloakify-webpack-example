const { resolveToEsbuildTarget } = require('esbuild-plugin-browserslist');
const { EsbuildPlugin } = require('esbuild-loader');
const browserslist = require("browserslist");

module.exports = (env) => {
    const isModeDevelopment = env === 'development';
    const isModeProduction = env === 'production';

    return {
        module: {
            rules: [
                // Use esbuild to compile JavaScript & TypeScript
                {
                  // Match `.js`, `.jsx`, `.ts` or `.tsx` files
                  test: /\.[jt]sx?$/,
                  loader: 'esbuild-loader',
                  options: {
                    // JavaScript version to compile to
                      target: resolveToEsbuildTarget(browserslist()),
                  },
                }
            ],
        },
        optimization: {
            minimize: true,
            minimizer: [
                new EsbuildPlugin({
                    target: resolveToEsbuildTarget(browserslist()),
                }),
            ],
        },
    }
};
