const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');

module.exports = function override(config, env) {
  config.output.crossOriginLoading = 'anonymous'
  config.plugins.push(
    new SubresourceIntegrityPlugin({
      hashFuncNames: ['sha256', 'sha384'],
      enabled: process.env.NODE_ENV === 'production'
    })
  )
  return config
}

