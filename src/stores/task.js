import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: []
  }),

  getters: {
    userTasks(state) {
      const userStore = useUserStore()
      return state.tasks.filter(t => t.ownerId === userStore.user?.username)
    }
  },

  actions: {
    addTask(task) {
      this.tasks.unshift(task)
    },
    updateTask(id, data) {
      const idx = this.tasks.findIndex(t => t.id === id)
      if (idx !== -1) Object.assign(this.tasks[idx], data)
      console.log('Task updated:', this.tasks[idx]);
    }
  }
})
