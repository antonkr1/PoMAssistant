<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore';
import { useUsers } from '@/composables/useUsers';
import { useRouter } from 'vue-router';

const isOpen = ref(false)
const userStore = useUserStore()
const { users, loadUsers } = useUsers()
const router = useRouter()

onMounted(() => {
    loadUsers()
})


const getUsername = computed(() => {
    const name = users.value.find(user => user.id === userStore.currentUserId)
    return name?.username ?? "Non connecté"
})

async function handleLogout() {
    await userStore.logout()
}

function handleLogin() {
    router.push('/login')
}

</script>

<template>
    <div class="showButton">
        <button @click="isOpen = !isOpen">
            <span>{{ getUsername }}</span>
        </button>
        <Transition name="fade">
            <div class="dropdown" v-if="isOpen">
                <button v-if="userStore.currentUserId" @click="handleLogout()">
                    <img src="/assets/images/logout.png" alt="Se déconnecter" class="logout-icon" />
                </button>
                <button v-else @click="handleLogin">
                    <img src="/assets/images/login.png" alt="Se connecter" class="logout-icon" />
                </button>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.showButton {
    position: relative;
}

.showButton button {
    background-color: var(--color-background-soft);
    border-radius: 8px;
    color: var(--color-text);
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.showButton button:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
}

.showButton button:active {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
}

.dropdown {
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
}

.logout-icon {
    width: 24px;
    height: 24px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.dropdown::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid var(--color-background-soft);
}
</style>