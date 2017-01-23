module.exports = {
  entry: './src/cal.js',
  output: {
    filename: './dist/bundle.js'
  },
  watch: true,
  target: 'node',
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
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.handlebars$/,
        loader: "handlebars-loader"
      }
    ],
  }
};