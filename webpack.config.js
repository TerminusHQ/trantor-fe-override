const path = require('path')
const { webpackBaseConfig, webpackMerge } = require('@terminus/t-nest/webpack');
const resolve = (...args)=> path.resolve( __dirname, ...args );

module.exports = (arg)=>{
  const baseConfig = webpackBaseConfig(arg, {
    externals: ['@terminus/nusi', '@terminus/nusi-engine', '@terminus/t-workspace', '@terminus/trantor-framework', '@terminus/t-extensions'],
    typescript: {
      include: [ resolve('./src') ],
    }
  });
  const webpackConfig = {
    entry: {
      't-overwrite': resolve('./src/index.ts'),
    },
    resolve: {
      symlinks: true
    }
  }
  return webpackMerge.merge(baseConfig, webpackConfig);
}
