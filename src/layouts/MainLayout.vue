<script setup>
import { useQuasar } from 'quasar'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user'
import { linksList } from 'src/constants/linksList'

import EssentialLink from 'components/EssentialLink.vue'

const leftDrawerOpen = ref(true)

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const router = useRouter()
const userStore = useUserStore()

function handleLogout() {

  userStore.logout()
  router.push('/login')
}

const $q = useQuasar()
const isDark = computed(() => $q.dark.isActive)

function toggleDarkMode() {
  $q.dark.set(!$q.dark.isActive)
}

</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      elevated
      v-if="!isLoginPage"
    >
      <q-toolbar class="bg-black text-white">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Task Manager App </q-toolbar-title>

        <q-btn
          dense
          flat
          round
          icon="dark_mode"
          @click="toggleDarkMode"
          :color="isDark ? 'yellow' : 'white'"
          :title="isDark ? 'Светлая тема' : 'Тёмная тема'"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="!isLoginPage"
      v-model="leftDrawerOpen"
      bordered
    >
      <div class="drawer-inner">
        <div class="user">
          <q-avatar
            color="primary"
            text-color="white"
          >
            {{ userStore.user?.username?.charAt(0).toUpperCase() || '?' }}
          </q-avatar>

          <div class="text-subtitle2 q-mr-md">
            {{ userStore.user?.username || 'Гость' }}
          </div>
        </div>

        <div class="drawer-content">
          <q-list>
            <q-item-label header> Essential Links </q-item-label>

            <EssentialLink
              v-for="link in linksList"
              :key="link.title"
              v-bind="link"
            />
          </q-list>
        </div>
        <q-item>
          <q-btn
            type="button"
            label="Выйти"
            color="primary"
            unelevated
            class="full-width"
            @click="handleLogout"
          />
        </q-item>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.drawer-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
