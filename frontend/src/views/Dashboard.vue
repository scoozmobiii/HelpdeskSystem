<template>
  <div class="dashboard-container container mx-auto p-4 sm:p-6 lg:p-8">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">My Support Tickets</h1>
      <router-link to="/tickets/new" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
        Create New Ticket
      </router-link>
    </div>

    <div v-if="loading" class="text-center text-gray-500 py-10">Loading...</div>
    <div v-else-if="tickets.length === 0" class="text-center bg-white p-10 rounded-lg shadow-sm">
      <p class="text-gray-500">You have no tickets yet. Click the button above to create one!</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="ticket in tickets" :key="ticket.id" class="bg-white rounded-lg shadow-md p-5 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all" @click="viewTicket(ticket.id)">
        <div class="flex justify-between items-start mb-3">
          <h3 class="font-bold text-lg text-gray-800 leading-tight">{{ ticket.title }}</h3>
          <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full" :class="statusClass(ticket.status)">
            {{ ticket.status }}
          </span>
        </div>
        <p class="text-sm text-gray-600 mb-4">Priority: 
          <span class="font-medium" :class="priorityClass(ticket.priority)">{{ ticket.priority }}</span>
        </p>
        <div class="text-xs text-gray-400 border-t border-gray-100 pt-3 mt-3">
          Created: {{ new Date(ticket.created_at).toLocaleString() }}
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

const tickets = ref([]);
const loading = ref(true);
const router = useRouter();
const authStore = useAuthStore(); // เรียกใช้ authStore

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

const viewTicket = (ticketId) => {
  router.push(`/tickets/${ticketId}`);
};

const statusClass = (status) => {
  const s = status.toLowerCase();
  if (s === 'new') return 'bg-blue-100 text-blue-800';
  if (s === 'assigned' || s === 'in progress') return 'bg-yellow-100 text-yellow-800';
  if (s === 'resolved') return 'bg-green-100 text-green-800';
  if (s === 'closed') return 'bg-gray-200 text-gray-800';
  return 'bg-gray-100 text-gray-800';
};

const priorityClass = (priority) => {
    const p = priority.toLowerCase();
    if (p === 'high') return 'text-red-600';
    if (p === 'medium') return 'text-orange-500';
    return 'text-green-600'; // Low
}

</script>
