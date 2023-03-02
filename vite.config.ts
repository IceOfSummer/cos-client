import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [
    vue({}),
    vueJsx({})
  ],
  base: mode === 'electron' ? (command === 'build' ? './' : 'file:///' + path.resolve(__dirname, './dist/')) : undefined,
  server: {
    port: 8888,
    cors: true, // 允许跨域
    hmr: true // 开启热更新
  }
}))
