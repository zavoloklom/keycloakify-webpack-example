const InlineRuntimeChunkScriptPlugin = require('../plugins/InlineRuntimeChunkScriptPlugin');

module.exports = (env) => {
    const isModeDevelopment = env === 'development';
    const isModeProduction = env === 'production';

    return {
        plugins: [
            // Optional. Inline runtime chunk into index.html
            new InlineRuntimeChunkScriptPlugin(),
        ],
        optimization: {
            splitChunks: {
              chunks: 'all',
            },
            // Keep the runtime chunk separated to enable long term caching
            runtimeChunk: {
              name: (entrypoint) => `runtime-${entrypoint.name}`,
            }
        }
    }
};
