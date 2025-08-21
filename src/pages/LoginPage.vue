<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const username = ref('')
const password = ref('')
const router = useRouter()
const userStore = useUserStore()

function handleLogin() {
  if (!username.value.trim() || !password.value.trim()) return

  const success = userStore.login(username.value.trim(), password.value)
  if (success) {
    router.push('/tasks')
  } else {
    // можно через $q.notify или alert
    $q.notify({ position: 'top', type: 'negative', message: 'Login: "admin"; Password: "1234"' })
  }
}
</script>

<template>
  <q-page class="flex flex-center">
    <q-card
      class="q-pa-lg"
      style="min-width: 300px; max-width: 400px;"
    >
      <q-card-section>
        <div class="text-h6 text-center">Вход в систему</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleLogin">
          <q-input
            outlined
            autofocus
            v-model="username"
            label="Имя пользователя"
            lazy-rules
            standout="false"
            :rules="[val => !!val || 'Введите имя']"
          >
            <template #prepend><q-icon name="person" /></template>
          </q-input>

          <q-input
            outlined
            v-model="password"
            type="password"
            label="Пароль"
            lazy-rules
            :rules="[val => !!val || 'Введите пароль']"
          >
            <template #prepend><q-icon name="lock" /></template>
          </q-input>

          <q-btn
            type="submit"
            label="Войти"
            color="primary"
            unelevated
            class="full-width"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style lang="scss">
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
  transition: background-color 5000s ease-in-out 0s;
}

.body--dark {

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px var(--q-dark) inset !important;
    -webkit-text-fill-color: #ffffff !important;
    transition: background-color 5000s ease-in-out 0s;
  }
}
</style>
