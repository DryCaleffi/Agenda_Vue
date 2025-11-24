<template>
  <div>
    <h2>Editar Evento</h2>
    <form @submit.prevent="submitForm">
      <label for="title">Título</label>
      <input type="text" id="title" v-model="title" required />

      <label for="date">Data</label>
      <input type="date" id="date" v-model="date" required />

      <label for="description">Descrição</label>
      <textarea id="description" v-model="description"></textarea>

      <button type="submit">Salvar</button>
    </form>
  </div>
</template>

<script>
export default {
  props: ['eventData'],
  data() {
    return {
      title: this.eventData.title,
      date: this.eventData.date,
      description: this.eventData.description,
    };
  },
  emits: ['edit-event'],
  methods: {
    submitForm() {
      this.$emit('edit-event', {
        ...this.eventData,
        title: this.title,
        date: this.date,
        description: this.description,
      });
    },
  },
};
</script>

<style scoped>
h2 {
  color: #4f46e5;
  margin-bottom: 1rem;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 0.3rem;
}

input, textarea {
  padding: 0.6rem 0.8rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
}

button {
  background-color: #4f46e5;
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.95rem;
}

button:hover {
  background-color: #3730a3;
}
</style>
