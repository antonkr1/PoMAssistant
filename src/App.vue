<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

import { useThemeStore } from '@/stores/themeStore'
import AccountBadge from './components/AccountBadge.vue'
import { useAppIcon } from './composables/useAppIcon'
import { useUserStore } from './stores/userStore.js'

useThemeStore()
const { appIcon, loadAppIcons, assignIcon } = useAppIcon()

const userStore = useUserStore()

const route = useRoute()

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

onMounted(async () => {
  await loadAppIcons()
  assignIcon()
})

watch(() => route.path, () => {
  assignIcon()
})
</script>

<template>
  <div class="menu-overlay" v-if="isMenuOpen" @click="toggleMenu()">
    <div class="router-links">
      <RouterLink to="/" class="app-icon-link">
        <img :src="`/assets/appicons/${appIcon}`" alt="App icon">
        <span>Hub</span>
      </RouterLink>
      <RouterLink to="/catalogue">Catalogue</RouterLink>
      <RouterLink to="/tracker">Tracker</RouterLink>
      <RouterLink to="/ressources">Ressources</RouterLink>
      <RouterLink to="/arena-duos" v-if="userStore.currentUserId">Duos de l'arène</RouterLink>
      <RouterLink to="/arena-resources" v-if="userStore.currentUserId">Ressources de l'arène</RouterLink>
      <RouterLink to="/settings">Settings</RouterLink>
      <AccountBadge v-if="userStore.currentUserId" @click.stop />
    </div>
  </div>
  <div class="router-view" :class="{ 'full-width': route.meta.fullWidth }">
    <button class="menu" @click="toggleMenu()">
      <img src="/assets/images/hamburger.png" alt="Menu déroulant">
    </button>
    <RouterView />
  </div>
</template>

<style scoped>
.menu {
  position: absolute;
  top: 16px;
  left: 16px;
  background-color: var(--color-background-soft);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  height: 60px;
  width: auto;
  padding: 8px;
}

.menu img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.router-links {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  height: 100dvh;
  background-color: var(--color-background-soft);
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
}

.router-view {
  position: relative;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-top: 80px;
}

.app-icon-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;

}

.app-icon-link img {
  height: 120px;
  width: auto;
  border-radius: 70px;
}

.app-icon span {
  font-size: 12px;
  color: var(--color-text);
}

.router-view.full-width {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}
</style>
