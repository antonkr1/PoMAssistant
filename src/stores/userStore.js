import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { supabase } from '@/services/supabase'

// Connexion via Discord (Supabase Auth). Le "profil" est la ligne de la table `users`
// reliée au compte connecté (colonne auth_id). Une personne appartient à une seule guilde.
// Messages de diagnostic, visibles dans la console uniquement en développement (npm run dev)
const debug = (...args) => { if (import.meta.env.DEV) console.info('[auth]', ...args) }

export const useUserStore = defineStore('user', () => {
  const session = ref(null)
  const profile = ref(null)
  let initPromise = null

  const isLoggedIn = computed(() => !!session.value)
  const currentUserId = computed(() => profile.value?.id ?? null)
  const currentArenaId = computed(() => profile.value?.arena_id ?? null)
  const isAdmin = computed(() => !!profile.value?.is_admin)

  async function loadProfile() {
    if (!session.value) {
      profile.value = null
      return
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, username, is_admin, arena_id')
      .eq('auth_id', session.value.user.id)
      .maybeSingle()

    if (error) {
      console.error('Erreur chargement du profil:', error)
      profile.value = null
      return
    }

    debug('profil chargé :', data)
    profile.value = data
  }

  // Appelée une seule fois : restaure la session puis écoute les changements.
  function init() {
    if (!initPromise) {
      initPromise = (async () => {
        debug('init, adresse =', window.location.href.replace(/(access_token|refresh_token|provider_token|provider_refresh_token|code)=[^&]+/g, '$1=…'))
        const { data, error } = await supabase.auth.getSession()
        debug('getSession : session =', !!data.session, 'erreur =', error?.message ?? null)
        session.value = data.session
        await loadProfile()

        supabase.auth.onAuthStateChange((event, newSession) => {
          debug('événement', event, '; session =', !!newSession)
          session.value = newSession
          // setTimeout : on ne lance pas de requête Supabase directement dans ce callback
          setTimeout(loadProfile, 0)
        })
      })()
    }
    return initPromise
  }

  async function loginWithDiscord() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: window.location.origin },
    })
    return error ? error.message : null
  }

  async function createGuild(name, username, discordGuildId) {
    const { error } = await supabase.rpc('create_guild', {
      p_name: name,
      p_username: username,
      p_discord_guild_id: discordGuildId || null,
    })
    if (error) return error.message
    await loadProfile()
    return null
  }

  async function joinGuild(inviteCode, username) {
    const { error } = await supabase.rpc('join_guild', {
      p_invite_code: inviteCode,
      p_username: username,
    })
    if (error) return error.message
    await loadProfile()
    return null
  }

  async function logout() {
    await supabase.auth.signOut()
    session.value = null
    profile.value = null
    // Rechargement complet : vide les données déjà chargées par les composables
    window.location.assign('/')
  }

  return {
    session,
    profile,
    isLoggedIn,
    currentUserId,
    currentArenaId,
    isAdmin,
    init,
    loadProfile,
    loginWithDiscord,
    createGuild,
    joinGuild,
    logout,
  }
})
