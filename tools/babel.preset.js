const { NODE_ENV, BUILD_ENV } = process.env;
const presetOptions = BUILD_ENV === 'hot' || BUILD_ENV === 'umd' ?
  { loose: true, modules: false } :
  { loose: true };

const plugins = [
  'transform-decorators-legacy',
];

module.exports = {
  presets: [
    ['env', presetOptions],
    'stage-1',
  ],
  plugins,
};