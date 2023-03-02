import { type RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home/HomeIndex.vue'

const UploadPage = async (): Promise<unknown> => await import('../views/Home/route/UploadPage.vue')
const StatusPage = async (): Promise<unknown> => await import('../views/Home/route/StatusPage.vue')
const UploadHistoryPage = async (): Promise<unknown> => await import('../views/Home/route/UploadHistoryPage.vue')

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/',
    redirect: '/home/statusPage'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/home/statusPage',
    children: [
      { path: 'statusPage', component: StatusPage },
      { path: 'upload', component: UploadPage },
      { path: 'uploadHistory', component: UploadHistoryPage }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
