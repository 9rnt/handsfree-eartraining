const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.module
      .rule('m4a')
      .test(/\.m4a$/)
      .use('file-loader')
        .loader('file-loader')
        .end()
  }
})