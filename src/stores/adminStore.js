import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useUserStore } from './userStore'

// Le rôle admin vient désormais de la guilde (users.is_admin) : plus de compte admin séparé.
export const useAdminStore = defineStore('admin', () => {
  const userStore = useUserStore()

  const isAdmin = computed(() => userStore.isAdmin)

  async function logout() {
    await userStore.logout()
  }

  return { isAdmin, logout }
})
