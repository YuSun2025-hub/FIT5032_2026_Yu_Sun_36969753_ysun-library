import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
  proxy: {
    '/api-fc': {
      target: 'https://countbooks-cfqhdeelui.cn-hongkong.fcapp.run/',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api-fc/, '/'),
      // 显式保证 Host 头与目标域名完全一致
      headers: {
        host: 'countbooks-cfqhdeelui.cn-hongkong.fcapp.run'
      }
    }
  }
},
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
