<template>
  <div class="container">
    <h1>📅 Agenda de Eventos</h1>

    <nav>
      <router-link to="/">Lista</router-link>
      <router-link to="/add">Adicionar</router-link>
    </nav>

    <router-view />
  </div>
</template>

<style>
.container {
  max-width: 650px;
  margin: auto;
  padding: 20px;
  font-family: Arial;
}
nav {
  margin: 20px 0;
  display: flex;
  gap: 10px;
}
nav a {
  text-decoration: none;
  background: #7a0bc0;
  color: #fff;
  padding: 8px 12px;
  border-radius: 5px;
}
nav a.router-link-active {
  background: #4c0070;
}
</style>
