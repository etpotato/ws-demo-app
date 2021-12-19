/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const purgecss = require('@fullhuman/postcss-purgecss');
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: isProd
    ? [
        purgecss({
          content: ['./src/**/*.html', './src/**/*.tsx', './src/**/*.ts']
        }),
        'postcss-preset-env',
      ]
    : ['postcss-preset-env'],
};
