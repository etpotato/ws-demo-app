/* eslint-disable no-undef */
const plugins = [];

if (process.env.NODE_ENV === 'serve') plugins.push(['react-refresh/babel', {skipEnvCheck: true}]);

module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins,
};
