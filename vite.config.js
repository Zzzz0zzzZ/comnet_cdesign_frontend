import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// import alias from "@rollup/plugin-alias";
// import resolve from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default ({ mode }) => defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, 'src')
    },
  },
  // build: {
  //   rollupOptions: {
  //     plugins:[
  //       resolve()
  //     ]
  //   },
  // },
  base: './',
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8889', // 凡是遇到 /api 路径的请求，都映射到 target 属性
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // 重写 api 为 空，就是去掉它
      }
    }
  },
})
