<template>
  <div class="container">
    <h1>Lista de Eventos</h1>

    <router-link to="/add">
      <button>Adicionar Evento</button>
    </router-link>

    <button @click="showList = true" v-if="!showList">
      Listar Eventos
    </button>

    <div v-if="showList">
      <input
        type="text"
        v-model="search"
        placeholder="Buscar evento..."
        class="search-input"
      />

      <ul v-if="filteredEvents.length">
        <li v-for="event in filteredEvents" :key="event.id">
          {{ event.name }} - {{ event.date }}
          <router-link :to="`/edit/${event.id}`">
            <button>Editar</button>
          </router-link>
        </li>
      </ul>

      <p v-else>Nenhum evento encontrado.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      events: [],
      search: "",
      showList: false, // controla se a lista será exibida
    };
  },
  computed: {
    filteredEvents() {
      return this.events.filter((event) =>
        event.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    loadEvents() {
      this.events = JSON.parse(localStorage.getItem("events") || "[]");
    },
  },
  mounted() {
    // Apenas carrega os eventos quando o usuário clicar em "Listar Eventos"
    this.$watch(
      () => this.showList,
      (newVal) => {
        if (newVal) this.loadEvents();
      }
    );

    // Atualiza a lista quando voltar da tela de adicionar ou editar
    this.$router.afterEach(() => {
      if (this.showList) this.loadEvents();
    });
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #4f46e5;
  margin-bottom: 1rem;
  text-align: center;
}

button {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 0.5rem;
}

button:hover {
  background-color: #3730a3;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.8rem;
  margin: 1rem 0;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}
</style>
