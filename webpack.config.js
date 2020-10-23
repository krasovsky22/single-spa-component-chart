const dotenv = require("dotenv");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");

const env = dotenv.config().parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "krasovsky",
    projectName: "test",
    webpackConfigEnv,
    externals: {
      react: "React",
      "react-dom": "ReactDOM",
      reactstrap: "Reactstrap",
    },
  });

  return webpackMerge.smart(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [new webpack.DefinePlugin(envKeys)],
  });
};
