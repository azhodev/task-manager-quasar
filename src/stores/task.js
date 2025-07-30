import { defineStore, acceptHMRUpdate } from 'pinia'
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
      const i = this.tasks.findIndex(t => t.id === id)
      if (i !== -1) Object.assign(this.tasks[i], data)
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTaskStore, import.meta.hot))
}
