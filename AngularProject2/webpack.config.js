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
            }
        ],
    }
};