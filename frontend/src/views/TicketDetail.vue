<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <div v-if="loading" class="text-center text-gray-500 py-10">Loading ticket details...</div>
    <div v-else-if="ticket" class="space-y-6">
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">{{ ticket.title }}</h1>
          <p class="text-sm text-gray-500">Ticket #{{ ticket.id }}</p>
        </div>
        <router-link 
          v-if="authStore.user?.role === 'staff' || authStore.user?.role === 'admin'" 
          to="/staff/dashboard" 
          class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 mt-2 sm:mt-0"
        >
          &larr; Back to Staff List
        </router-link>
        <router-link 
          v-else 
          to="/dashboard" 
          class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 mt-2 sm:mt-0"
        >
          &larr; Back to My Tickets
        </router-link>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-4 border-b pb-2">Ticket Details</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><strong>Creator:</strong><br>{{ ticket.creator_name }}</div>
              <div><strong>Created:</strong><br>{{ new Date(ticket.created_at).toLocaleString() }}</div>
              <div><strong>Priority:</strong><br><span class="font-medium" :class="priorityClass(ticket.priority)">{{ ticket.priority }}</span></div>
              <div><strong>Status:</strong><br><span class="text-xs font-semibold px-2.5 py-1 rounded-full" :class="statusClass(ticket.status)">{{ ticket.status }}</span></div>
              <div class="sm:col-span-2"><strong>Assigned to:</strong><br>{{ ticket.assignee_name || 'Unassigned' }}</div>
            </div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-2">Description</h3>
            <p class="text-gray-700 whitespace-pre-wrap">{{ ticket.description }}</p>
          </div>
        </div>

        <div class="lg:col-span-1" v-if="authStore.user?.role === 'staff' || authStore.user?.role === 'admin'">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-4">Actions</h3>
            
            <div v-if="authStore.user?.role === 'admin'">
              <div v-if="ticket.status === 'New'" class="space-y-2">
                <label for="assignee" class="text-sm font-medium">Assign to:</label>
                <select id="assignee" v-model="selectedAssignee" class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option :value="null" disabled>Select a staff member</option>
                  <option v-for="staff in staffList" :key="staff.id" :value="staff.id">{{ staff.name }}</option>
                </select>
                <button @click="assignTicket" :disabled="!selectedAssignee" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300">Assign</button>
              </div>
              <div v-else-if="ticket.status === 'Closed'">
                <p class="text-sm text-gray-500 text-center">This ticket is closed.</p>
              </div>
              <div v-else>
                <p class="text-sm text-gray-500 text-center">This ticket is being handled by staff.</p>
              </div>
            </div>

            <div v-if="authStore.user?.role === 'staff'">
              <div v-if="ticket.status === 'New'">
                <p class="text-sm text-gray-500 text-center">This ticket has not been assigned yet.</p>
              </div>

              <div v-if="ticket.status === 'Assigned'">
                <button v-if="String(authStore.user?.id) === String(ticket.assignee_id)" @click="startProgress" class="w-full bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-700">
                  Start Progress
                </button>
                <p v-else class="text-sm text-gray-500 text-center">This ticket is assigned to another staff member.</p>
              </div>

              <div v-if="ticket.status === 'In Progress'">
                <button v-if="String(authStore.user?.id) === String(ticket.assignee_id)" @click="resolveTicket" class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
                  Mark as Resolved
                </button>
                <p v-else class="text-sm text-gray-500 text-center">This ticket is in progress.</p>
              </div>

              <div v-if="ticket.status === 'Resolved'">
                 <button v-if="String(authStore.user?.id) === String(ticket.assignee_id)" @click="closeTicket" class="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800">
                   Close Ticket
                 </button>
                 <p v-else class="text-sm text-gray-500 text-center">This ticket has been resolved.</p>
              </div>
              
              <div v-if="ticket.status === 'Closed'">
                <p class="text-sm text-gray-500 text-center">This ticket is closed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Conversation</h3>
        <div class="space-y-4 mb-6">
          <div v-if="!ticket.comments || ticket.comments.length === 0" class="text-sm text-gray-500">No comments yet.</div>
          <div v-else v-for="comment in ticket.comments" :key="comment.id" class="flex gap-3">
            <div class="flex-shrink-0">
               <div class="h-10 w-10 rounded-full flex items-center justify-center text-white" :class="comment.author_role === 'user' ? 'bg-gray-400' : 'bg-blue-500'">{{ comment.author_name.charAt(0).toUpperCase() }}</div>
            </div>
            <div class="w-full bg-gray-50 rounded-lg px-4 py-2">
              <p class="font-semibold text-sm">{{ comment.author_name }} <span class="text-xs text-gray-500 font-light">{{ new Date(comment.created_at).toLocaleString() }}</span></p>
              <p class="text-gray-700 text-sm whitespace-pre-wrap">{{ comment.comment_text }}</p>
            </div>
          </div>
        </div>
        <div v-if="ticket.status !== 'Closed'" class="border-t pt-4">
          <textarea v-model="newCommentText" placeholder="Write a comment..." rows="3" class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          <div class="flex justify-end mt-2">
            <button @click="submitComment" :disabled="!newCommentText.trim()" class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300">Submit Comment</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 py-10">Ticket not found.</div>
  </div>
</template>

<script setup>
// Script ไม่มีการเปลี่ยนแปลง
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '../api/axios';
import { useAuthStore } from '../stores/authStore';

const route = useRoute();
const router = useRouter();
const ticket = ref(null);
const loading = ref(true);
const ticketId = route.params.id;
const authStore = useAuthStore();
const staffList = ref([]);
const selectedAssignee = ref(null);
const newCommentText = ref('');

const fetchData = async () => {
  try {
    const ticketResponse = await apiClient.get(`/tickets/${ticketId}`);
    ticket.value = ticketResponse.data;
    if (authStore.user?.role === 'staff' || authStore.user?.role === 'admin') {
      const staffResponse = await apiClient.get('/users/staff');
      staffList.value = staffResponse.data;
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
    ticket.value = null; 
  } finally {
    loading.value = false;
  }
};
onMounted(fetchData);

const assignTicket = async () => {
  if (!selectedAssignee.value) return;
  try {
    await apiClient.put(`/tickets/${ticketId}/assign`, { assigneeId: selectedAssignee.value });
    alert('Ticket assigned successfully!');
    fetchData();
  } catch (error) {
    alert('Failed to assign ticket.');
  }
};
const resolveTicket = async () => {
  try {
    await apiClient.post(`/tickets/${ticketId}/resolve`);
    alert('Ticket marked as Resolved!');
    fetchData();
  } catch (error) {
    alert('Failed to resolve ticket.');
  }
};
const closeTicket = async () => {
  try {
    await apiClient.post(`/tickets/${ticketId}/close`);
    alert('Ticket closed successfully!');
    fetchData();
  } catch (error) {
    alert('Failed to close ticket.');
  }
};
const submitComment = async () => {
  if (!newCommentText.value.trim()) return;
  try {
    await apiClient.post(`/tickets/${ticketId}/comments`, {
      comment_text: newCommentText.value,
    });
    newCommentText.value = '';
    fetchData();
  } catch (error) {
    alert('Failed to submit comment.');
  }
};
const startProgress = async () => {
  try {
    await apiClient.post(`/tickets/${ticketId}/start`);
    alert('You have started working on this ticket!');
    fetchData();
  } catch (error) {
    alert(`Error: ${error.response?.data?.message || 'Could not start progress.'}`);
  }
};

const statusClass = (status) => {
  const s = status ? status.toLowerCase() : '';
  if (s === 'new') return 'bg-blue-100 text-blue-800';
  if (s === 'assigned') return 'bg-yellow-100 text-yellow-800';
  if (s.includes('progress')) return 'bg-purple-100 text-purple-800';
  if (s === 'resolved') return 'bg-green-100 text-green-800';
  if (s === 'closed') return 'bg-gray-200 text-gray-800';
  return 'bg-gray-100 text-gray-800';
};
const priorityClass = (priority) => {
    const p = priority ? priority.toLowerCase() : '';
    if (p === 'high') return 'text-red-600';
    if (p === 'medium') return 'text-orange-500';
    return 'text-green-600';
};
</script>