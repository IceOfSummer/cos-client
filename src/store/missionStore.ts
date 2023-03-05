import { defineStore } from 'pinia'
import { Mission } from '../api/cos/types'

export type MissionStore = {
  missions: Mission<unknown>[],
  totalCount: number
  finishedCount: number
}

const useMissionStore = defineStore('mission', {
  persist: false,
  state: (): MissionStore => ({
    missions: [],
    totalCount: 0,
    finishedCount: 0
  }),
  actions: {
    /**
     * 添加一个任务
     * @param mission 任务
     */
    addMission(mission: Mission<unknown>) {
      this.missions = [...this.missions, mission]
      this.totalCount++
    },
    /**
     * 将任务完成数加一
     */
    incrFinishedCount() {
      this.finishedCount++
    },
    /**
     * 将任务完成数减一
     */
    decFinishedCount() {
      this.finishedCount--
    }
  }
})

export default useMissionStore
