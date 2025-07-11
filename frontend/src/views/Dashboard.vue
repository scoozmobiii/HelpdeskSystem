<template>
  <div class="dashboard">
    <div class="header">
      <h1>My Tickets</h1>
      <button @click="handleLogout">Logout</button>
    </div>

    <router-link to="/tickets/new" class="create-btn">Create New Ticket</router-link>

    <div class="ticket-list">
      <div v-if="loading">Loading tickets...</div>
      
      <div v-else-if="tickets.length === 0">You have no tickets.</div>

      <div v-else>
        <div v-for="ticket in tickets" :key="ticket.id" class="ticket-item" @click="viewTicket(ticket.id)">
          <h3>{{ ticket.title }}</h3>
          <p>Status: <span :class="`status-${ticket.status.toLowerCase()}`">{{ ticket.status }}</span></p>
          <p>Priority: {{ ticket.priority }}</p>
          <small>Created on: {{ new Date(ticket.created_at).toLocaleString() }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import apiClient from '../api/axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const tickets = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await apiClient.get('/tickets/my');
    tickets.value = response.data;
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
  } finally {
    loading.value = false;
  }
});

const handleLogout = () => {
  authStore.logout();
};

const viewTicket = (ticketId) => {
  router.push(`/tickets/${ticketId}`);
};
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 20px auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.create-btn {
  margin: 20px 0;
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: inline-block;
  text-decoration: none;
}
.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.ticket-item {
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}
.ticket-item:hover {
  background-color: #f9f9f9;
}
.status-new {
  color: blue;
}
.status-in.progress { 
  color: orange;
}
</style>