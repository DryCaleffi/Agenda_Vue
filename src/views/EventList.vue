<template>
  <div class="dashboard">
    <div class="stats-bar">
      <div class="stat-card">
        <h3>Total</h3>
        <p>{{ events.length }}</p>
      </div>
      <div class="stat-card highlight">
        <h3>Próximo Evento</h3>
        <p v-if="nextEvent">{{ countdown }}</p>
        <p v-else>--</p>
        <small v-if="nextEvent">{{ nextEvent.title }}</small>
      </div>
      <div class="stat-card">
        <h3>Pendentes</h3>
        <p>{{ events.filter(e => e.status === 'Pendente' || !e.status).length }}</p>
      </div>
      <div class="stat-card">
        <h3>Concluídos</h3>
        <p>{{ events.filter(e => e.status === 'Concluído').length }}</p>
      </div>
      <div class="stat-card">
        <h3>Trabalho</h3>
        <p>{{ events.filter(e => e.category === 'Trabalho').length }}</p>
      </div>
    </div>

    <div class="controls">
      <div class="input-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-search">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input v-model="search" placeholder="Buscar eventos..." class="search-input" />
      </div>
      
      <select v-model="filterCategory">
        <option value="">Todas Categorias</option>
        <option>Trabalho</option>
        <option>Pessoal</option>
        <option>Estudos</option>
        <option>Saúde</option>
        <option>Lazer</option>
      </select>

      <select v-model="filterDate">
        <option value="">Todas as Datas</option>
        <option value="today">Hoje</option>
        <option value="week">Esta Semana</option>
        <option value="month">Este Mês</option>
      </select>

      <select v-model="filterStatus">
        <option value="">Todos os Status</option>
        <option value="Pendente">Pendente</option>
        <option value="Em andamento">Em andamento</option>
        <option value="Concluído">Concluído</option>
        <option value="Cancelado">Cancelado</option>
      </select>

      <button @click="$router.push('/add')" class="btn btn-primary">
        + Novo Evento
      </button>
      
      <div class="data-actions">
        <button @click="exportEvents" class="btn btn-ghost" title="Exportar JSON">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </button>
        <label class="btn btn-ghost" title="Importar JSON">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <input type="file" @change="importEvents" style="display:none" accept=".json">
        </label>
      </div>
    </div>

    <div v-if="filteredEvents.length > 0" class="events-grid">
      <div 
        v-for="event in filteredEvents" 
        :key="event.id" 
        class="card event-card"
        :class="{ 'is-past': isPast(event.date) }"
      >
        <div class="card-header">
          <div class="badges">
            <span class="badge" :class="event.priority">{{ event.priority }}</span>
            <span class="badge status" :class="getStatusClass(event.status || 'Pendente')">{{ event.status || 'Pendente' }}</span>
          </div>
          <span class="category-tag">{{ event.category }}</span>
        </div>
        
        <h3>{{ event.title }}</h3>
        
        <p class="event-date">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {{ formatDate(event.date) }}
        </p>
        
        <p class="event-desc">{{ event.description }}</p>

        <div class="card-footer">
          <button @click="duplicateEvent(event)" class="btn-icon" title="Duplicar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          
          <button @click="$router.push(`/edit/${event.id}`)" class="btn-icon" title="Editar">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          
          <button @click="remove(event.id)" class="btn-icon delete" title="Excluir">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); opacity: 0.5;">
        <polyline points="21 8 21 21 3 21 3 8"></polyline>
        <rect x="1" y="3" width="22" height="5"></rect>
        <line x1="10" y1="12" x2="14" y2="12"></line>
      </svg>
      <p>Nenhum evento encontrado</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import EventService from '../services/EventService';

const props = defineProps(['notify']); 
const emit = defineEmits(['notify']);

const events = ref([]);
const search = ref('');
const filterCategory = ref('');
const filterDate = ref('');
const filterStatus = ref('');
const now = ref(new Date());
let timer = null;

// Carregar dados
const loadEvents = () => {
  events.value = EventService.getEvents().sort((a, b) => new Date(a.date) - new Date(b.date));
};

onMounted(() => {
  loadEvents();
  timer = setInterval(() => { now.value = new Date(); }, 1000);
});

onUnmounted(() => clearInterval(timer));

// Lógica Computada
const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(search.value.toLowerCase());
    const matchesCat = !filterCategory.value || event.category === filterCategory.value;
    const matchesStatus = !filterStatus.value || event.status === filterStatus.value;
    const matchesDate = filterByDate(event);
    return matchesSearch && matchesCat && matchesStatus && matchesDate;
  });
});

const nextEvent = computed(() => {
  return events.value.find(e => new Date(e.date) > now.value);
});

const countdown = computed(() => {
  if (!nextEvent.value) return '';
  const diff = new Date(nextEvent.value.date) - now.value;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return `${days}d ${hours}h restantes`;
});

// Ações
const remove = (id) => {
  if (confirm('Tem certeza?')) {
    EventService.deleteEvent(id);
    loadEvents();
    emit('notify', 'Evento removido', 'info');
  }
};

const duplicateEvent = (event) => {
  const newEvent = {
    ...event,
    id: undefined,
    title: `${event.title} (Cópia)`,
    status: 'Pendente'
  };
  EventService.saveEvent(newEvent);
  loadEvents();
  emit('notify', 'Evento duplicado com sucesso!');
};

const filterByDate = (event) => {
  if (!filterDate.value) return true;
  
  const eventDate = new Date(event.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  switch (filterDate.value) {
    case 'today':
      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 59, 999);
      return eventDate >= today && eventDate <= todayEnd;
    
    case 'week':
      const weekStart = new Date(today);
      const weekEnd = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      return eventDate >= weekStart && eventDate <= weekEnd;
    
    case 'month':
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);
      return eventDate >= monthStart && eventDate <= monthEnd;
    
    default:
      return true;
  }
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
};

const isPast = (dateStr) => new Date(dateStr) < now.value;

const getStatusClass = (status) => {
  const statusMap = {
    'Pendente': 'pendente',
    'Em andamento': 'em-andamento', 
    'Concluído': 'concluido',
    'Cancelado': 'cancelado'
  };
  return statusMap[status] || 'pendente';
};

const exportEvents = () => {
  const data = EventService.exportData();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'agenda-backup.json';
  a.click();
};

const importEvents = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (res) => {
    if (EventService.importData(res.target.result)) {
      loadEvents();
      emit('notify', 'Dados importados com sucesso!');
    } else {
      emit('notify', 'Arquivo inválido', 'error');
    }
  };
  reader.readAsText(file);
};
</script>

<style scoped>
.dashboard { padding: 1rem; max-width: 1000px; margin: 0 auto; }

/* Stats Bar */
.stats-bar { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.stat-card { background: var(--bg-card); padding: 1rem; border-radius: var(--radius); text-align: center; border: 1px solid var(--border); }
.stat-card.highlight { border-color: var(--primary); background: rgba(99, 102, 241, 0.1); }
.stat-card h3 { font-size: 0.9rem; color: var(--text-muted); margin: 0; }
.stat-card p { font-size: 1.5rem; font-weight: bold; margin: 0.5rem 0 0; }

/* Controls */
.controls { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; align-items: stretch; }

/*  Ícone Input */
.input-wrapper {
  display: flex;
  align-items: center;
  background: var(--bg-body);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0 0.75rem;
  flex: 2;
  min-width: 200px;
  transition: border-color 0.2s;
}
.input-wrapper:focus-within { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2); }
.input-wrapper .icon-search { color: var(--text-muted); flex-shrink: 0; }
.search-input {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  margin-bottom: 0 !important;
  padding: 0.75rem 0.5rem;
  color: var(--text-main);
  outline: none;
  width: 100%;
}

.data-actions { margin-left: auto; display: flex; gap: 0.5rem; }

/* Grid */
.events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }

/* Card Styling */
.event-card { display: flex; flex-direction: column; position: relative; overflow: hidden; transition: transform 0.2s; }
.event-card:hover { transform: translateY(-5px); }
.event-card.is-past { opacity: 0.6; filter: grayscale(0.8); }

.card-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
.category-tag { font-size: 0.8rem; color: var(--text-muted); }

.badges { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.badge.status.pendente { background: #f59e0b; color: white; }
.badge.status.em-andamento { background: #3b82f6; color: white; }
.badge.status.concluido { background: #22c55e; color: white; }
.badge.status.cancelado { background: #ef4444; color: white; }

.event-date { 
  color: var(--primary); 
  font-weight: bold; 
  display: flex; 
  align-items: center; 
  gap: 0.4rem; 
}

.event-desc { flex: 1; color: var(--text-muted); font-size: 0.9rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.card-footer { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; border-top: 1px solid var(--border); padding-top: 0.5rem; }

.btn-icon { 
  background: none; 
  border: none; 
  cursor: pointer; 
  transition: transform 0.2s, color 0.2s; 
  color: var(--text-muted); 
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-icon:hover { transform: scale(1.1); color: var(--primary); }
.btn-icon.delete:hover { color: var(--danger); }

.empty-state { text-align: center; padding: 3rem; color: var(--text-muted); }
</style>