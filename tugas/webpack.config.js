const DotenvWebpackPlugin = require('dotenv-webpack');
const path = require('path');

module.exports = {
  entry: {
    tasks: './src/tasks/main.js',
    worker: './src/worker/main.js',
    performance: './src/performance/main.js',
    workerschema: './schema/worker.js',
    taskschema: './schema/task.js',
    performanceschema: './schema/performance.js',
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
  plugins: [
    new DotenvWebpackPlugin({
      path: './.env.example',
      safe: true,
    }),
  ],
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
