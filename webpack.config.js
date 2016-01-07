module.exports = {
  context: __dirname,
  entry: "./machine.js",
  output: {
    path: "./js",
    publicPath: "/js/",
    filename: "bundle.js",
    devtoolModuleFilenameTemplate: '[resourcePath]',
    devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
  },
  devtool: 'source-maps'
};
