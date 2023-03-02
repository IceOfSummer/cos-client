import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

console.log(__dirname)
// https://vitejs.dev/config/
export default defineConfig(({command}) => ({
  plugins: [vue()],
  base: command === 'build' ? './' : 'file:///' + path.resolve(__dirname, './dist/'),
  server: {
    port: 8888,
    cors: true, // 允许跨域
    hmr: true, // 开启热更新
  },
}))
