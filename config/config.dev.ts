import { defineConfig } from 'umi';

export default defineConfig({
  plugins: ['react-dev-inspector/plugins/umi/react-inspector'],
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
  proxy: {
    '/api/': {
      // target: 'https://preview.pro.ant.design',
      target: 'http://192.168.1.110:9000/lims',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
});
