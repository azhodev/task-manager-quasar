import { useUserStore } from 'stores/user'
import { Notify } from 'quasar'

export function authGuard(to, from, next) {
  const store = useUserStore()

  const isProtected = to.meta.requiresAuth === true

  if (isProtected && !store.isAuthenticated) {
    Notify.create({ position: 'top', type: 'info', message: 'Login: "admin"; Password: "1234"' })
    next('/login')
  } else {
    next()
  }
}
