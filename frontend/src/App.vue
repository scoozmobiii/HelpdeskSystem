<template>
  <div id="app">
    <nav v-if="authStore.isAuthenticated">
      <router-link to="/">Home</router-link> |
      <router-link to="/kb">Knowledge Base</router-link> |
      <router-link v-if="authStore.user?.role === 'admin'" to="/admin/users">User Management</router-link>
      <RouterLink v-if="authStore.user?.role === 'admin'" to="/admin/dashboard">Reporting</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router';
import { useAuthStore } from './stores/authStore';
const authStore = useAuthStore();
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
nav {
  padding: 20px;
  text-align: center;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}
nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  padding: 0 10px;
}
nav a.router-link-exact-active {
  color: #42b983;
}
</style>