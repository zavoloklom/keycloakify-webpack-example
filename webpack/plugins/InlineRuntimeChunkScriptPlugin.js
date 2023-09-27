const HtmlWebpackPlugin = require('html-webpack-plugin');
const getInlineRuntime = (compilation, assets) => {
  let runtimeJs = '';
  for (const file in compilation.assets) {
    if (file.includes('runtime-')) {
      runtimeJs += compilation.assets[file].source();
    }
  }
  return runtimeJs;
}

class InlineRuntimeChunkScriptPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('InlineRuntimeChunkScriptPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
        'InlineRuntimeChunkScriptPlugin',
        (data, cb) => {
          // Вставка содержимого runtime в HTML
          const inlineRuntime = getInlineRuntime(compilation, data);
          data.assetTags.scripts.unshift({
            tagName: 'script',
            voidTag: false,
            attributes: { type: 'text/javascript' },
            innerHTML: inlineRuntime
          });

          // Удаление всех <script> тегов, которые содержат runtime-
          data.assetTags.scripts = data.assetTags.scripts.filter(scriptTag =>
            !scriptTag.attributes.src || !scriptTag.attributes.src.includes('runtime-')
          );

          cb(null, data);
        }
      );
    });
  }
}

module.exports = InlineRuntimeChunkScriptPlugin;
