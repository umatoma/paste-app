module.exports = {
  entry: './client/index.jsx',
  output: {
    filename: './server/public/bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
        include: __dirname,
      },
    ],
  },
};
