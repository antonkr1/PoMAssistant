import { createRouter, createWebHistory } from 'vue-router'
import HubView from '../views/HubView.vue'
import { useUserStore } from '@/stores/userStore.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HubView,
      meta: { fullWidth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/catalogue',
      name: 'catalogue',
      component: () => import('../views/CatalogueView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('../views/OnboardingView.vue'),
    },
    {
      path: '/tracker',
      name: 'tracker',
      component: () => import('../views/TrackerView.vue'),
    },
    {
      path: '/ressources',
      name: 'ressources',
      component: () => import('../views/RessourcesView.vue'),
    },
    {
      path: '/arena-duos',
      name: 'arena-duos',
      component: () => import('../views/ArenaDuosView.vue'),
    },
    {
      path: '/arena-resources',
      name: 'arena-resources',
      component: () => import('../views/ArenaResourcesView.vue'),
    },
  ],
})

// Il faut être connecté (Discord) et appartenir à une guilde pour utiliser l'app.
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  await userStore.init()
  if (import.meta.env.DEV) {
    console.info('[auth] navigation vers', to.fullPath.split(/[?#]/)[0], '; connecté =', userStore.isLoggedIn, '; profil =', !!userStore.currentUserId)
  }

  if (!userStore.isLoggedIn) {
    // On garde la query et le hash : Supabase y met le message d'erreur en cas d'échec de connexion
    return to.name === 'login' ? true : { name: 'login', query: to.query, hash: to.hash }
  }

  if (!userStore.currentUserId) {
    return to.name === 'onboarding' ? true : { name: 'onboarding' }
  }

  if (to.name === 'login' || to.name === 'onboarding') {
    return { name: 'home' }
  }
})

export default router
