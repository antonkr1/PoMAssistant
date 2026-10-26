<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const mode = ref('join')
const username = ref('')
const inviteCode = ref('')
const guildName = ref('')
const discordGuildId = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function submit() {
  errorMessage.value = ''
  isLoading.value = true

  const error = mode.value === 'join'
    ? await userStore.joinGuild(inviteCode.value, username.value)
    : await userStore.createGuild(guildName.value, username.value, discordGuildId.value)

  if (error) {
    errorMessage.value = error
    isLoading.value = false
    return
  }

  // Rechargement complet : repart d'un état propre avec la nouvelle guilde
  window.location.assign('/')
}
</script>

<template>
  <div>
    <h1>Bienvenue</h1>
    <p>Tu n'appartiens à aucune guilde pour l'instant.</p>

    <div class="mode-switch">
      <button type="button" :class="{ active: mode === 'join' }" @click="mode = 'join'">Rejoindre une guilde</button>
      <button type="button" :class="{ active: mode === 'create' }" @click="mode = 'create'">Créer une guilde</button>
    </div>

    <form @submit.prevent="submit">
      <input v-model="username" type="text" placeholder="Ton pseudo" minlength="2" maxlength="32" required>

      <template v-if="mode === 'join'">
        <input v-model="inviteCode" type="text" placeholder="Code d'invitation" required>
      </template>

      <template v-else>
        <input v-model="guildName" type="text" placeholder="Nom de la guilde" minlength="2" maxlength="40" required>
        <input v-model="discordGuildId" type="text" placeholder="ID du serveur Discord (facultatif)">
      </template>

      <button type="submit" :disabled="isLoading">
        {{ mode === 'join' ? 'Rejoindre' : 'Créer la guilde' }}
      </button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}

.mode-switch {
  display: flex;
  gap: 8px;
  margin: 16px 0;
}

.mode-switch button {
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: none;
  color: var(--color-text);
  cursor: pointer;
}

.mode-switch button.active {
  background-color: var(--color-background-soft);
  font-weight: bold;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 300px;
}

form input {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-background-soft);
  color: var(--color-text);
}

form button[type="submit"] {
  padding: 8px 16px;
  border-radius: 6px;
  background-color: var(--color-text);
  color: var(--color-background);
  border: none;
  cursor: pointer;
}

form button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: default;
}

.error-message {
  color: rgb(172, 32, 32);
  font-size: 0.9rem;
}
</style>
