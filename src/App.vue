<template>
  <div class="app-container">
    <nav class="navbar">
      <div class="brand">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        AgendaVue
      </div>
      
      <div class="nav-links">
        <router-link to="/">Dashboard</router-link>
        <button @click="toggleTheme" class="theme-btn" :title="isDark ? 'Mudar para Claro' : 'Mudar para Escuro'">
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </nav>

    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" @notify="triggerToast" />
        </transition>
      </router-view>
    </main>

    <ToastNotification ref="toastRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ToastNotification from './components/ToastNotification.vue';

const toastRef = ref(null);
const isDark = ref(false);

const triggerToast = (msg, type) => {
  toastRef.value.add(msg, type);
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.body.classList.toggle('dark-mode', isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDark.value = true;
    document.body.classList.add('dark-mode');
  }
});
</script>

<style>
@import './assets/base.css';

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand { 
  font-size: 1.5rem; 
  font-weight: bold; 
  color: var(--primary); 
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-links { display: flex; gap: 1rem; align-items: center; }
.nav-links a { text-decoration: none; color: var(--text-main); font-weight: 500; }
.nav-links a:hover { color: var(--primary); }

.theme-btn { 
  background: none; 
  border: 1px solid var(--border); 
  padding: 0.5rem; 
  border-radius: 50%; 
  cursor: pointer; 
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.theme-btn:hover { background: var(--bg-body); border-color: var(--primary); }

main { padding-top: 2rem; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>