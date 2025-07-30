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
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />

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
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user'
import EssentialLink from 'components/EssentialLink.vue'

const leftDrawerOpen = ref(false)

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
]

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
