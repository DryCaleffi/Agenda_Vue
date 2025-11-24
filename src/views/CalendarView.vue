<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <h2>Calendário</h2>
      <div class="month-navigation">
        <button @click="previousMonth" class="btn-icon" title="Mês Anterior">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <h3>{{ currentMonthName }} {{ currentYear }}</h3>
        
        <button @click="nextMonth" class="btn-icon" title="Próximo Mês">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 6 15 12 9 18"></polyline>
          </svg>
        </button>
      </div>

      <div class="calendar-actions">
        <button @click="goToToday" class="btn btn-ghost">Hoje</button>
        <button @click="$router.push('/add')" class="btn btn-primary">+ Novo Evento</button>
      </div>
    </div>

    <div class="calendar-grid">

      <!-- Dias da semana -->
      <div class="weekday-headers">
        <div v-for="day in weekDays" :key="day" class="weekday-header">
          {{ day }}
        </div>
      </div>

      <!-- Dias do mês -->
      <div class="days-grid">
        <div 
          v-for="day in calendarDays" 
          :key="`${day.date}-${day.isCurrentMonth}`"
          class="calendar-day"
          :class="{
            'other-month': !day.isCurrentMonth,
            'today': isToday(day.date),
            'has-events': day.events.length > 0
          }"
          @click="selectDay(day)"
        >
          <div class="day-number">{{ day.dayNumber }}</div>
          
          <!-- Indicadores de eventos -->
          <div class="events-indicators">
            <div 
              v-for="event in day.events.slice(0, 3)" 
              :key="event.id"
              class="event-indicator"
              :class="getStatusClass(event.status)"
              :title="`${event.title} - ${event.status}`"
            >
              <span class="event-title">{{ event.title }}</span>
            </div>
            
            <!-- Indicador de mais eventos -->
            <div v-if="day.events.length > 3" class="more-events">
              +{{ day.events.length - 3 }} mais
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Eventos do dia selecionado -->
    <div v-if="selectedDay" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Eventos de {{ formatSelectedDate(selectedDay.date) }}</h3>
          <button @click="closeModal" class="btn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div v-if="selectedDay.events.length === 0" class="no-events">
            <p>Nenhum evento neste dia</p>
            <button @click="addEventForDay" class="btn btn-primary">
              + Adicionar Evento
            </button>
          </div>
          
          <div v-else class="events-list">
            <div 
              v-for="event in selectedDay.events" 
              :key="event.id"
              class="event-item"
              :class="getStatusClass(event.status)"
            >
              <div class="event-info">
                <h4>{{ event.title }}</h4>
                <p class="event-time">{{ formatTime(event.date) }}</p>
                <p class="event-desc">{{ event.description }}</p>
                <div class="event-tags">
                  <span class="tag">{{ event.category }}</span>
                  <span class="tag priority">{{ event.priority }}</span>
                  <span class="tag status">{{ event.status }}</span>
                </div>
              </div>
              
              <div class="event-actions">
                <button @click="editEvent(event.id)" class="btn-icon" title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <button @click="addEventForDay" class="btn btn-ghost add-more">
              + Adicionar Mais Eventos
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import EventService from '../services/EventService';

const emit = defineEmits(['notify']);
const router = useRouter();

const events = ref([]);
const selectedDay = ref(null);
const currentDate = ref(new Date());

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const currentMonthName = computed(() => monthNames[currentDate.value.getMonth()]);
const currentYear = computed(() => currentDate.value.getFullYear());

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Primeiro dia da semana do calendário
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());
  
  // Último dia da semana do calendário
  const endDate = new Date(lastDay);
  endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
  
  const days = [];
  const currentDay = new Date(startDate);
  
  while (currentDay <= endDate) {
    const dayEvents = getEventsForDate(currentDay);
    
    days.push({
      date: new Date(currentDay),
      dayNumber: currentDay.getDate(),
      isCurrentMonth: currentDay.getMonth() === month,
      events: dayEvents
    });
    
    currentDay.setDate(currentDay.getDate() + 1);
  }
  
  return days;
});

// Métodos
const loadEvents = () => {
  events.value = EventService.getEvents();
};

const getEventsForDate = (date) => {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  return events.value.filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === targetDate.getTime();
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
};

const isToday = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return today.getTime() === compareDate.getTime();
};

const getStatusClass = (status) => {
  const statusMap = {
    'Pendente': 'pendente',
    'Em andamento': 'em-andamento',
    'Concluído': 'concluido',
    'Cancelado': 'cancelado'
  };
  return statusMap[status] || 'pendente';
};

const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const formatSelectedDate = (date) => {
  return date.toLocaleDateString('pt-BR', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Navegação
const previousMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentDate.value = newDate;
};

const nextMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentDate.value = newDate;
};

const goToToday = () => {
  currentDate.value = new Date();
};

// Dia selecionado
const selectDay = (day) => {
  selectedDay.value = day;
};

const closeModal = () => {
  selectedDay.value = null;
};

const addEventForDay = () => {
  const dateStr = selectedDay.value.date.toISOString().slice(0, 16);
  router.push(`/add?date=${dateStr}`);
};

const editEvent = (eventId) => {
  router.push(`/edit/${eventId}`);
  closeModal();
};

onMounted(() => {
  loadEvents();
});
</script>

<style scoped>
.calendar-container {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.month-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.month-navigation h3 {
  margin: 0;
  min-width: 200px;
  text-align: center;
  color: var(--text-main);
}

.calendar-actions {
  display: flex;
  gap: 0.5rem;
}

.calendar-grid {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.weekday-headers {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--primary);
  color: white;
}

.weekday-header {
  padding: 1rem 0.5rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-day {
  min-height: 120px;
  border: 1px solid var(--border);
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  flex-direction: column;
}

.calendar-day:hover {
  background: var(--bg-body);
}

.calendar-day.other-month {
  opacity: 0.4;
  background: var(--bg-body);
}

.calendar-day.today {
  background: rgba(99, 102, 241, 0.1);
  border-color: var(--primary);
}

.calendar-day.has-events {
  background: rgba(34, 197, 94, 0.05);
}

.day-number {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-main);
}

.events-indicators {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.event-indicator {
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
  color: white;
  cursor: pointer;
}

.event-indicator.pendente { background: #f59e0b; }
.event-indicator.em-andamento { background: #3b82f6; }
.event-indicator.concluido { background: #22c55e; }
.event-indicator.cancelado { background: #ef4444; }

.event-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.more-events {
  font-size: 0.6rem;
  color: var(--text-muted);
  text-align: center;
  padding: 0.1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-card);
  border-radius: var(--radius);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: var(--shadow);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.modal-header h3 {
  margin: 0;
  color: var(--text-main);
}

.modal-body {
  padding: 1.5rem;
}

.no-events {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  border-left: 4px solid;
}

.event-item.pendente { border-left-color: #f59e0b; }
.event-item.em-andamento { border-left-color: #3b82f6; }
.event-item.concluido { border-left-color: #22c55e; }
.event-item.cancelado { border-left-color: #ef4444; }

.event-info {
  flex: 1;
}

.event-info h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-main);
}

.event-time {
  font-weight: 600;
  color: var(--primary);
  margin: 0.2rem 0;
}

.event-desc {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.event-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.tag {
  padding: 0.2rem 0.5rem;
  background: var(--bg-body);
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.tag.priority { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.tag.status { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }

.event-actions {
  display: flex;
  gap: 0.5rem;
}

.add-more {
  margin-top: 1rem;
  width: 100%;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, color 0.2s;
  color: var(--text-muted);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.btn-icon:hover {
  transform: scale(1.1);
  color: var(--primary);
  background: var(--bg-body);
}

/* Responsividade */
@media (max-width: 768px) {
  .calendar-container {
    padding: 0.5rem;
  }
  
  .calendar-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .calendar-day {
    min-height: 80px;
  }
  
  .weekday-header {
    padding: 0.5rem 0.25rem;
  }
  
  .day-number {
    font-size: 0.9rem;
  }
  
  .event-indicator {
    font-size: 0.6rem;
    padding: 0.1rem 0.3rem;
  }
  
  .modal-content {
    width: 95%;
    max-height: 90vh;
  }
  
  .modal-header, .modal-body {
    padding: 1rem;
  }
}
</style>