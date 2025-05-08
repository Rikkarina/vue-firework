import { fileURLToPath } from 'node:url'
import path from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
    }),
    viteMockServe({
      supportTs: false,
      mockPath: 'mock',
      localEnabled: true,
      logger: true, // 启用控制台日志输出
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "@/styles/element/index.scss" as *;
        @use "@/styles/var.scss" as *;
        `,
      },
    },
  },
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  envDir: './',
  envPrefix: 'VITE_',
  // 这里可以添加http.js需要的环境变量
  define: {
    'process.env': {
      // 示例环境变量，根据http.js实际需求修改
      API_BASE_URL: JSON.stringify('http://localhost:3000'),
    },
  },
})
