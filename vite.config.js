import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';
import { resolve } from 'path';

export default defineConfig({
  plugins: [svgLoader()],
  build:{
    rollupOptions: {
      // input: [resolve(__dirname, 'wab_cn235.html'), resolve(__dirname, 'wab_c208.html')],
      input: resolve(__dirname, 'wab_cn235.html')
    },
  },
  base: ['XYChart_dist']
});