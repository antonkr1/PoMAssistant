<script setup>
import { computed, onMounted, ref } from 'vue'
import { supabase } from '@/services/supabase'
import { useThemeStore } from '@/stores/themeStore'
import { useAdminStore } from '@/stores/adminStore'
import { useArenas } from '@/composables/useArenas'
import { useUsers } from '@/composables/useUsers';
import { useHistory } from '@/composables/useHistory';

const store = useThemeStore()
const adminStore = useAdminStore()
const { historyRows, loadHistory } = useHistory()
const { users, loadUsers } = useUsers()
const { arenas, loadArenas } = useArenas()

const guild = computed(() => arenas.value[0] ?? null)
const inviteCode = ref('')
const inviteError = ref('')

onMounted(async () => {
  await loadArenas()
  inviteCode.value = guild.value?.invite_code ?? ''
})

async function regenerateInviteCode() {
  inviteError.value = ''
  const { data, error } = await supabase.rpc('regenerate_invite_code')
  if (error) {
    inviteError.value = error.message
    return
  }
  inviteCode.value = data
}

function prepareTable() {
  const updatedTable = historyRows.value.map((entry) => {
    const matchingUser = users.value.find((user) => user.id === entry.user_id)
    return {
      username: matchingUser?.username ?? entry.user_id,
      duo_key: entry.duo_key,
      old_investment_level: entry.old_investment_level,
      new_investment_level: entry.new_investment_level,
      old_has_ex_role: entry.old_has_ex_role,
      new_has_ex_role: entry.new_has_ex_role
    }
  })
  return updatedTable
}

function toCsvCell(value) {
  let text = String(value ?? '')
  if (/^[=+\-@]/.test(text)) text = `'${text}`
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

async function downloadHistoryCSV() {
  await Promise.all([
    loadHistory(),
    loadUsers()
  ])

  const updatedTable = prepareTable()
  if (updatedTable.length === 0) return

  const firstLine = Object.keys(updatedTable[0]).join(',')
  const otherLines = updatedTable.map((row) => Object.values(row).map(toCsvCell).join(','))
  const CSV = [firstLine, ...otherLines].join('\n')

  const blob = new Blob(['\uFEFF' + CSV], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'history.csv'
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div>
    <h1>Réglages</h1>
    <div class="theme-switch">
      <button @click="store.setTheme('light')" :class="{ active: store.theme === 'light' }">
        <span>Thème clair</span>
        <img src="/assets/images/sol.png" alt="Thème clair">
      </button>
      <button @click="store.setTheme('dark')" :class="{ active: store.theme === 'dark' }">
        <span>Thème sombre</span>
        <img src="/assets/images/lun.png" alt="Thème sombre">
      </button>
    </div>
    <div v-if="adminStore.isAdmin" class="admin-section">
      <p>Admin de la guilde {{ guild?.name }}</p>
      <p>Code d'invitation : <strong>{{ inviteCode }}</strong></p>
      <button @click="regenerateInviteCode()">Générer un nouveau code</button>
      <p v-if="inviteError" class="error-message">{{ inviteError }}</p>
      <button @click="downloadHistoryCSV()">Télécharger l'historique de modifications</button>
    </div>
    <div class="desc">
      <span>Version 1.0</span>
      <br>
      <span>Contact sur Discord : @minegear</span>
    </div>
  </div>
</template>

<style scoped>
.theme-switch {
  display: flex;
  gap: 1rem;
}

.theme-switch button {
  border: none;
  background: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
}

.theme-switch span {
  color: var(--color-heading);
  text-align: center;
}

.theme-switch button.active {
  background-color: rgba(0, 0, 0, 0.1);
}

.theme-switch img {
  width: 48px;
  height: 48px;
}

.admin-section {
  display: flex;
  flex-direction: column;
  width: 25%;
}

.error-message {
  color: rgb(172, 32, 32);
  font-size: 0.9rem;
}
</style>