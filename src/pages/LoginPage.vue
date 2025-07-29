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
        <q-form
          @submit.prevent="handleLogin"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="username"
            label="Имя пользователя"
            lazy-rules
            :rules="[val => !!val || 'Введите имя']"
          />
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

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user'

const username = ref('')
const router = useRouter()
const userStore = useUserStore()

function handleLogin() {
  if (!username.value.trim()) return

  userStore.login(username.value.trim())
  router.push('/tasks')
}
</script>
