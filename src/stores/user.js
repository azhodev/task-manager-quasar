import { defineStore, acceptHMRUpdate } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.user
  },
  actions: {
    login(username) {
      this.user = { username }  // Упрощённая
    },
    logout() {
      this.user = null
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
