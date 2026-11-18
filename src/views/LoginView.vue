<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const route = useRoute()

// Après un échec de connexion, Supabase renvoie ici avec l'erreur dans l'adresse (?error_description=... ou #error_description=...)
const hashParams = new URLSearchParams(route.hash.replace(/^#/, ''))
const urlError = route.query.error_description || hashParams.get('error_description') || ''
const errorMessage = ref(urlError ? `La connexion a échoué : ${urlError}` : '')
const isLoading = ref(false)

async function login() {
  errorMessage.value = ''
  isLoading.value = true
  const error = await userStore.loginWithDiscord()
  if (error) {
    errorMessage.value = error
    isLoading.value = false
  }
  // Sans erreur, le navigateur part vers Discord puis revient sur l'application.
}
</script>

<template>
  <div class="login">
    <h1>Connexion</h1>
    <p>Connecte-toi avec ton compte Discord pour accéder à ta guilde.</p>
    <button type="button" class="discord-button" :disabled="isLoading" @click="login">
      Se connecter avec Discord
    </button>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.discord-button {
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  background-color: #5865f2;
  color: white;
  cursor: pointer;
}

.discord-button:disabled {
  opacity: 0.6;
  cursor: default;
}

.error-message {
  color: rgb(172, 32, 32);
  font-size: 0.9rem;
}
</style>
