<template>
  <div class="container">
    <h1>Adicionar Evento</h1>
    <form @submit.prevent="save">
      <label for="name">Nome do evento</label>
      <input id="name" v-model="name" placeholder="Nome do evento" required />

      <label for="date">Data</label>
      <input id="date" v-model="date" type="date" required />

      <button type="submit">Salvar</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      date: "",
    };
  },
  methods: {
    save() {
      // Pega os eventos já salvos no localStorage
      const events = JSON.parse(localStorage.getItem("events") || "[]");

      // Adiciona o novo evento
      events.push({
        id: Date.now(),
        name: this.name,
        date: this.date,
      });

      // Salva de volta no localStorage
      localStorage.setItem("events", JSON.stringify(events));

      // Limpa os campos
      this.name = "";
      this.date = "";

      // Redireciona para a lista de eventos
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #4f46e5;
  margin-bottom: 1.5rem;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 0.4rem;
}

input {
  padding: 0.6rem 0.8rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

button {
  background-color: #4f46e5;
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3730a3;
}
</style>
