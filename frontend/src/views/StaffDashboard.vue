<template>
  <div class="dashboard-container container mx-auto p-4 sm:p-6 lg:p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">All Support Tickets</h1>
    </div>

    <div v-if="loading" class="text-center text-gray-500 py-10">Loading tickets...</div>
    <div v-else-if="error" class="text-center text-red-500 py-10">{{ error }}</div>
    
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-700">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">ID</th>
              <th scope="col" class="px-6 py-3">Title</th>
              <th scope="col" class="px-6 py-3">Creator</th>
              <th scope="col" class="px-6 py-3">Priority</th>
              <th scope="col" class="px-6 py-3">Status</th>
              <th scope="col" class="px-6 py-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ticket in tickets" :key="ticket.id" @click="viewTicket(ticket.id)" class="bg-white border-b hover:bg-gray-50 cursor-pointer">
              <td class="px-6 py-4 font-medium text-gray-900">#{{ ticket.id }}</td>
              <td class="px-6 py-4">{{ ticket.title }}</td>
              <td class="px-6 py-4">{{ ticket.creator_name }}</td>
              <td class="px-6 py-4">
                <span class="font-medium" :class="priorityClass(ticket.priority)">{{ ticket.priority }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full" :class="statusClass(ticket.status)">
                  {{ ticket.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-500">{{ new Date(ticket.created_at).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api/axios';

const tickets = ref([]);
const loading = ref(true);
const error = ref(null);
const router = useRouter();

onMounted(async () => {
  try {
    const response = await apiClient.get('/tickets');
    tickets.value = response.data;
  } catch (err) {
    error.value = 'Failed to load tickets. Please try again.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const viewTicket = (ticketId) => {
  router.push(`/tickets/${ticketId}`);
};

// ฟังก์ชันสำหรับกำหนดสีของสถานะและ Priority
const statusClass = (status) => {
  const s = status ? status.toLowerCase() : '';
  if (s === 'new') return 'bg-blue-100 text-blue-800';
  if (s === 'assigned' || s.includes('progress')) return 'bg-yellow-100 text-yellow-800';
  if (s === 'resolved') return 'bg-green-100 text-green-800';
  if (s === 'closed') return 'bg-gray-200 text-gray-800';
  return 'bg-gray-100 text-gray-800';
};

const priorityClass = (priority) => {
    const p = priority ? priority.toLowerCase() : '';
    if (p === 'high') return 'text-red-600';
    if (p === 'medium') return 'text-orange-500';
    return 'text-green-600'; // Low
}
</script>
