const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      const eslintPlugin = new ESLintPlugin({
        extensions: ['js', 'jsx'],
        fix: true,
        emitWarning: true,
        emitError: true
      });
      webpackConfig.plugins.push(eslintPlugin);
      return webpackConfig;
    }
  }
};