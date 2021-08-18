export default {
  dev: {
    '/api': {
      target: 'http://localhost:8090/propro',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'http://localhost:8090/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
