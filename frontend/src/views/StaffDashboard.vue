<template>
  <div class="dashboard-container">
    <div class="header">
      <h1>All Tickets</h1>
      <button @click="handleLogout">Logout</button>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <table v-else class="ticket-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Creator</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="ticket in tickets"
          :key="ticket.id"
          @click="viewTicket(ticket.id)"
          class="clickable-row"
        >
          <td>{{ ticket.id }}</td>
          <td>{{ ticket.title }}</td>
          <td>{{ ticket.creator_name }}</td>
          <td>{{ ticket.priority }}</td>
          <td>
            <span :class="`status-${ticket.status.toLowerCase()}`">{{ ticket.status }}</span>
          </td>
          <td>{{ new Date(ticket.created_at).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import apiClient from '../api/axios'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const tickets = ref([])
const loading = ref(true)
const error = ref(null)
const router = useRouter()

onMounted(async () => {
  try {
    const response = await apiClient.get('/tickets') // เรียก API ดึง ticket ทั้งหมด
    tickets.value = response.data
  } catch (err) {
    console.error('Failed to fetch tickets:', err)
    error.value = 'Failed to load tickets. Please try again.'
  } finally {
    loading.value = false
  }
})

const handleLogout = () => {
  authStore.logout()
}

const viewTicket = (ticketId) => {
  router.push(`/tickets/${ticketId}`)
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.ticket-table {
  width: 100%;
  border-collapse: collapse;
}
.ticket-table th,
.ticket-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.ticket-table th {
  background-color: #f2f2f2;
}
.status-new {
  color: blue;
  font-weight: bold;
}
.clickable-row {
  cursor: pointer;
}
.clickable-row:hover {
  background-color: #f5f5f5;
}
</style>
