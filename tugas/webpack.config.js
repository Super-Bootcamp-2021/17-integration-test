const path = require('path');

module.exports = {
  entry: {
    tasks: './src/tasks/main.js',
    worker: './src/worker/main.js',
    performance: './src/performance/main.js',
    schema: './schema/main.js',
  },
  output: {
    path: path.resolve(__dirname, 'www'),
    filename: '[name].js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './www',
    port: 7000,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.yaml$/,
        use: [{ loader: 'json-loader' }, { loader: 'yaml-loader' }],
      },
    ],
  },
};