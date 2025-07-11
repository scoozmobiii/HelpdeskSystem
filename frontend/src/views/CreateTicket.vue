<template>
  <div class="create-ticket-container">
    <h2>Create New Ticket</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" v-model="title" id="title" required />
      </div>
      <div class="form-group">
        <label for="priority">Priority</label>
        <select v-model="priority" id="priority" required>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea v-model="description" id="description" rows="5" required></textarea>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Submitting...' : 'Submit Ticket' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api/axios';

const title = ref('');
const description = ref('');
const priority = ref('Medium');
const errorMessage = ref('');
const loading = ref(false);
const router = useRouter();

const handleSubmit = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    await apiClient.post('/tickets', {
      title: title.value,
      description: description.value,
      priority: priority.value,
    });
    router.push('/dashboard');
  } catch (error) {
    console.error('Failed to create ticket:', error);
    errorMessage.value = 'Failed to create ticket. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.create-ticket-container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; }
.form-group { margin-bottom: 15px; }
label { display: block; margin-bottom: 5px; }
input, select, textarea { width: 100%; padding: 8px; box-sizing: border-box; }
.error-message { color: red; }
button { padding: 10px 15px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
button:disabled { background-color: #ccc; }
</style>