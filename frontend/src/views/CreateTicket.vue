<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Create a New Support Ticket</h1>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input 
              type="text" 
              v-model="title" 
              id="title" 
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Cannot connect to the printer"
            />
          </div>

          <div>
            <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
            <select 
              v-model="priority" 
              id="priority" 
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              v-model="description" 
              id="description" 
              rows="5" 
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Please describe the issue in detail..."
            ></textarea>
          </div>
          
          <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
          
          <div class="flex justify-end gap-4 pt-2">
            <button 
              type="button" 
              @click="handleCancel"
              class="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="loading"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 disabled:bg-gray-300"
            >
              {{ loading ? 'Submitting...' : 'Submit Ticket' }}
            </button>
          </div>
        </form>
      </div>
    </div>
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
const handleCancel = () => {
  router.push('/dashboard');
};

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