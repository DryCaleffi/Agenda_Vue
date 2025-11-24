<template>
  <div class="card form-card">
    <h2>{{ isEditing ? 'Editar Evento' : 'Novo Evento' }}</h2>
    
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>Título</label>
        <input v-model="form.title" required placeholder="Ex: Reunião de Projeto" />
      </div>

      <div class="row">
        <div class="col">
          <label>Data e Hora</label>
          <input type="datetime-local" v-model="form.date" required />
        </div>
        <div class="col">
          <label>Categoria</label>
          <select v-model="form.category">
            <option>Trabalho</option>
            <option>Pessoal</option>
            <option>Estudos</option>
            <option>Saúde</option>
            <option>Lazer</option>
          </select>
        </div>
      </div>

      <div class="form-group priority-group">
        <label>Prioridade</label>
        <div class="priority-options">
          <label v-for="p in ['Baixa', 'Média', 'Alta']" :key="p" class="radio-label">
            <input type="radio" v-model="form.priority" :value="p">
            <span class="custom-radio" :class="p.toLowerCase()">{{ p }}</span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>Descrição Detalhada</label>
        <textarea v-model="form.description" rows="4" placeholder="Detalhes do evento..."></textarea>
      </div>

      <div class="actions">
        <button type="button" @click="$router.push('/')" class="btn btn-ghost">Cancelar</button>
        <button type="submit" class="btn btn-primary">{{ isEditing ? 'Atualizar' : 'Salvar' }}</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import EventService from '../services/EventService';
import { useRouter, useRoute } from 'vue-router';

const props = defineProps(['eventId']);
const emit = defineEmits(['notify']);
const router = useRouter();
const route = useRoute();

const isEditing = ref(false);
const form = ref({
  title: '',
  date: '',
  category: 'Pessoal',
  priority: 'Média',
  description: ''
});

onMounted(() => {
  const id = route.params.id;
  if (id) {
    isEditing.value = true;
    const event = EventService.getEvent(id);
    if (event) form.value = { ...event };
  }
});

const submitForm = () => {
  EventService.saveEvent(form.value);
  emit('notify', 'Evento salvo com sucesso!');
  router.push('/');
};
</script>

<style scoped>
.form-card { max-width: 600px; margin: 2rem auto; }
.row { display: flex; gap: 1rem; }
.col { flex: 1; }

.form-group { margin-bottom: 1.5rem; }

.priority-group { margin-bottom: 2rem; }

.actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }

.priority-options { display: flex; gap: 10px; margin-top: 0.5rem; }
.radio-label input { display: none; }
.custom-radio {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 20px;
  cursor: pointer;
  transition: 0.2s;
  font-size: 0.9rem;
}

input:checked + .custom-radio { border-color: transparent; color: white; }
input:checked + .custom-radio.baixa { background: #166534; }
input:checked + .custom-radio.média { background: #ea580c; }
input:checked + .custom-radio.alta { background: #dc2626; }
</style>

<style>

body.dark-mode input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  filter: invert(1); /* Inverte a cor preta para branca */
  cursor: pointer;
  opacity: 0.8;
}
</style>