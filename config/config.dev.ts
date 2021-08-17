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
      target: 'http://localhost:8080/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
});
