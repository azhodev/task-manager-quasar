import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    login(username, password) {
      // Упрощённая проверка: логин admin, пароль 1234
      if (username === 'admin' && password === '1234') {
        this.user = { username }
        return true
      }
      return false
    },
    logout() {
      this.user = null
    }
  }
})
