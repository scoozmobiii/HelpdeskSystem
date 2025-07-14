<template>
  <div class="kb-container container mx-auto p-4 sm:p-6 lg:p-8">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Knowledge Base</h1>
        <p class="mt-1 text-sm text-gray-500">Find solutions and answers to common questions.</p>
      </div>
      <router-link
        v-if="authStore.user?.role === 'staff' || authStore.user?.role === 'admin'"
        to="/kb/new"
        class="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
      >
        Create New Article
      </router-link>
    </div>

    <div class="relative mb-8">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
        </div>
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Search articles by keyword..." 
          @input="fetchArticles" 
          class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
    </div>

    <div v-if="loading" class="text-center text-gray-500 py-10">Loading articles...</div>
    <div v-else-if="articles.length === 0" class="text-center bg-white p-10 rounded-lg shadow-sm">
        <p class="text-gray-500">No articles found matching your search.</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="article in articles" :key="article.id" class="bg-white rounded-lg shadow-md p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all">
        <h2 class="font-bold text-lg text-gray-800 mb-2">{{ article.title }}</h2>
        <p class="text-sm text-gray-600 flex-grow" v-html="article.snippet + '...'"></p>
        <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <p class="text-xs text-gray-400">Updated: {{ new Date(article.updated_at).toLocaleDateString() }}</p>
            <router-link :to="`/kb/${article.id}`" class="text-xs font-bold bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full no-underline transition-colors">Read More</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import apiClient from '../api/axios';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();
const articles = ref([]);
const loading = ref(true);
const searchTerm = ref('');
let debounceTimer;

const fetchArticles = () => {
  clearTimeout(debounceTimer);
  loading.value = true;
  debounceTimer = setTimeout(async () => {
    try {
      const response = await apiClient.get('/kb', {
        params: { searchTerm: searchTerm.value },
      });
      articles.value = response.data;
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      loading.value = false;
    }
  }, 300);
};

onMounted(fetchArticles);
</script>
