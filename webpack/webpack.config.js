const { merge } = require('webpack-merge');
const commonConfig = require("./configs/common.config");
const tsConfig = require("./configs/ts-loader.config");
const babelConfig = require("./configs/babel-loader.config");
const esbuildConfig = require("./configs/esbuild-loader.config");
const runtimeConfig = require("./configs/runtime-chunk.config");
const minimalConfig = require("./configs/minimal.config");

const builder = process.env.BUILDER;
const env = process.env.NODE_ENV || "development";

console.log("Builder:", builder);
console.log("Environment:", env);

let config;

switch (builder) {
    case "esbuild":
        config = merge(commonConfig(env), esbuildConfig(env));
        break;
    case "babel":
        config = merge(commonConfig(env), babelConfig(env));
        break;
    case "ts":
        config = merge(commonConfig(env), tsConfig(env));
        break;
    case "runtime":
        config = merge(commonConfig(env), babelConfig(env), runtimeConfig(env));
        break;
    case "minimal":
        config = minimalConfig(env);
        break;
    default:
        console.warn("No builder specified, using minimal config");
        config = minimalConfig(env);
        break;
}

module.exports = config;
