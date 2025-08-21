// stores/status.js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useStatusStore = defineStore('status', {
  state: () => ({
    statuses: [
      { key: 'todo', title: 'К выполнению' },
      { key: 'in_progress', title: 'В процессе' },
      { key: 'done', title: 'Выполнено' }
    ]
  }),

  getters: {
    userStatuses(state) {
      const userStore = useUserStore()
      return state.statuses.filter(s => s.ownerId === userStore.user?.username)
    }
  },

  actions: {
    addStatus(status) {
      if (!this.statuses.find(s => s.key === status.key)) {
        this.statuses.push(status)
      }
    },
    removeStatus(key) {
      this.statuses = this.statuses.filter(s => s.key !== key)
    }
  }
})
