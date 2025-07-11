<template>
  <div v-if="loading">Loading ticket details...</div>
  <div v-else-if="ticket" class="ticket-detail-container">
    <div class="header">
      <h1>Ticket #{{ ticket.id }}: {{ ticket.title }}</h1>
      <router-link v-if="authStore.user?.role === 'staff' || authStore.user?.role === 'admin'" to="/staff/dashboard">Back to Staff List</router-link>
      <router-link v-else to="/dashboard">Back to My Tickets</router-link>
    </div>

    <div class="details-grid">
      <div><strong>Creator:</strong> {{ ticket.creator_name }}</div>
      <div><strong>Created At:</strong> {{ new Date(ticket.created_at).toLocaleString() }}</div>
      <div><strong>Priority:</strong> {{ ticket.priority }}</div>
      <div><strong>Status:</strong> <span :class="`status-${ticket.status.toLowerCase()}`">{{ ticket.status }}</span></div>
      <div><strong>Assigned to:</strong> {{ ticket.assignee_name || 'Unassigned' }}</div>
    </div>

    <div class="description-box">
      <h3>Description</h3>
      <p>{{ ticket.description }}</p>
    </div>

    <div class="action-panel" v-if="authStore.user?.role === 'staff' || authStore.user?.role === 'admin'">
      <h3>Actions</h3>
      <div v-if="ticket.status === 'New'">
        <select v-model="selectedAssignee">
          <option :value="null" disabled>Select a staff member to assign</option>
          <option v-for="staff in staffList" :key="staff.id" :value="staff.id">
            {{ staff.name }}
          </option>
        </select>
        <button @click="assignTicket" :disabled="!selectedAssignee">Assign</button>
      </div>
      <div v-if="['Assigned', 'In Progress'].includes(ticket.status)">
        <button @click="resolveTicket">Mark as Resolved</button>
      </div>
      <div v-if="ticket.status === 'Resolved'">
        <button @click="closeTicket">Close Ticket</button>
      </div>
      <div v-if="ticket.status === 'Closed'">
        <p>This ticket is closed.</p>
      </div>
    </div>
    
    <div class="comment-section">
      <h3>Comments</h3>
      <div class="comment-list">
        <div v-if="!ticket.comments || ticket.comments.length === 0">No comments yet.</div>
        <div v-else v-for="comment in ticket.comments" :key="comment.id" class="comment-item" :class="`role-${comment.author_role}`">
          <p class="comment-author"><strong>{{ comment.author_name }}</strong> ({{ comment.author_role }}) says:</p>
          <p class="comment-text">{{ comment.comment_text }}</p>
          <small class="comment-date">{{ new Date(comment.created_at).toLocaleString() }}</small>
        </div>
      </div>
      <div v-if="ticket.status !== 'Closed'" class="comment-form">
        <textarea v-model="newCommentText" placeholder="Write a comment..." rows="4"></textarea>
        <button @click="submitComment" :disabled="!newCommentText.trim()">Submit Comment</button>
      </div>
    </div>

  </div> <div v-else>Ticket not found.</div>
</template>

<script setup>
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
</script>

<style scoped>
.ticket-detail-container { max-width: 800px; margin: 20px auto; padding: 20px; }
.header { display: flex; justify-content: space-between; align-items: center; }
.details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
.description-box { padding: 15px; border: 1px solid #eee; margin-top: 20px; white-space: pre-wrap; }
.action-panel { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; }
.action-panel select { margin-right: 10px; }
.status-new { color: blue; font-weight: bold; }
.status-assigned { color: purple; font-weight: bold; }
.status-resolved { color: green; font-weight: bold; }
.status-closed { color: grey; }
.comment-section { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; }
.comment-list { display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px; }
.comment-item { padding: 10px; border-radius: 5px; border: 1px solid #e0e0e0; }
.comment-item.role-staff { background-color: #e7f3ff; }
.comment-item.role-admin { background-color: #fffbe7; }
.comment-author { margin: 0; font-size: 0.9em; }
.comment-text { margin: 5px 0; white-space: pre-wrap; }
.comment-date { font-size: 0.8em; color: #888; }
.comment-form textarea { width: 100%; margin-bottom: 10px; padding: 8px; box-sizing: border-box; }
.comment-form button { float: right; }
</style>