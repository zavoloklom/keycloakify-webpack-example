# Keycloakify + Webpack Example

This is example repository (src folder is a copy
from [keycloakify-starter](https://github.com/keycloakify/keycloakify-starter)) that
shows how to use [Keycloakify](https://github.com/keycloakify/keycloakify) with Webpack 5.

It is not a template, but you can use it as a starting point for your own project. For requirements for
Webpack configuration, please read [this section](#requirements-for-webpack-settings).

## How to start

```bash
git clone https://github.com/keycloakify/keycloakify-starter

cd keycloakify-webpack-example

yarn # install dependencies
```

You can test different Webpack configurations by executing commands:

```bash
yarn build-minimal       # Build with babel-loader on minimal working config.
yarn build-babel         # Build with babel-loader and Terser minification.
yarn build-babel-runtime # Build with babel-loader and Terser minification. Runtime chunk is extracted.
yarn build-ts            # Build with ts-loader and Terser minification.
yarn build-esbuild       # Build with esbuild-loader and Esbuild minification. Not working with ES5 target.
```

Read the instruction printed on the console to see how to test theme on a real Keycloak instance.

## Requirements for Webpack Configuration

> If you prefer code above documentation - take a look at [minimal working configuration](./webpack/configs/minimal.config.js).

**Base rules:**

- The output directory should be set to `build`.
- JavaScript files should be located in `build/static/js`.
- CSS files should be located in `build/static/css`.

**Webpack output:**

- Set `output.publicPath` to `/` to ensure all assets load correctly.

**Javascript:**

- Ensure both `output.filename` and `output.chunkFilename` are configured to store JavaScript files in `build/static/js`.
- `optimization.minimize` must be set to true.
- You can use any combination of `babel-loader`, `ts-loader`, `esbuild-loader`, and `terser`.
- `TerserPlugin` is optional.

**Styles:**

- If utilizing MiniCssExtractPlugin, configure filename to store files in `build/static/css`.
- If utilizing `style-loader`, it is working without any specific configuration.
- Loader `postcss-loader` is optional.

**Assets:**

- Configure `assetModuleFilename` to store files in `build/static`.
- You may need to set `generator.filename` in 'asset/resource' loaders to ensure assets are loaded appropriately.

**Other:**

- Make sure to copy all files from the `public` folder to `build` folder, excluding `index.html`, either with the `EventHooksPlugin` or `CopyWebpackPlugin`.
