module.exports = {
  entry: './src/stoplight.js',
  output: {
    filename: './bundle.js'
  },
  watch: true,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /\.html$/,
        loader: 'html',
        query: {
          minimize: false
        }
      }
    ],
  }
};