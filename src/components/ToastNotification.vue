<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const toasts = ref([]);

const add = (message, type = 'success') => {
  const id = Date.now();
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 3000);
};

defineExpose({ add });
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.toast {
  padding: 1rem 2rem;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.toast.success { background: var(--success); }
.toast.error { background: var(--danger); }
.toast.info { background: var(--primary); }

/* Animação Vue */
.toast-enter-active, .toast-leave-active { transition: all 0.5s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(30px); }
</style>