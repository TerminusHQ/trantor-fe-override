
// type Shared | Workspace | Module

module.exports = {

  // 模块名称
  name: 't-overwrite',

  // 包含包名
  package: ['@terminus/overwrite'],

  // 当前类型
  type: 'Module',

  // 导出对象
  exposes: {
    "@terminus/overwrite": "t-overwrite.js",
  },

  // 公共位置
  public: '/dev-overwrite',

  // 非打包依赖
  externals: [],

  // 三方依赖信息
  dependencies: {
  },

  // 是否使用本地
  librarys: false,

  injects: ['@terminus/overwrite']


};
