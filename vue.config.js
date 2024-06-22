const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: '/handsfree-eartraining/',
  transpileDependencies: true,
  chainWebpack: config => {
    config.module
      .rule('m4a')
      .test(/\.m4a$/)
      .use('file-loader')
        .loader('file-loader')
        .options({
          name: '[name].[hash:8].[ext]'
        })
        .end()
  }
})