<template>
  <div class="kb-container">
    <div class="header">
      <h1>Knowledge Base</h1>
      <router-link
        v-if="authStore.user?.role === 'staff' || authStore.user?.role === 'admin'"
        to="/kb/new"
        class="btn-create"
      >
        Create New Article
      </router-link>
    </div>

    <div class="search-bar">
      <input type="text" v-model="searchTerm" placeholder="Search articles..." @input="fetchArticles" />
    </div>

    <div v-if="loading">Loading articles...</div>
    <div v-else-if="articles.length === 0">No articles found.</div>
    <div v-else class="article-list">
      <div v-for="article in articles" :key="article.id" class="article-item">
        <h2>{{ article.title }}</h2>
        <p>{{ article.snippet }}...</p>
        <small>Last updated: {{ new Date(article.updated_at).toLocaleString() }}</small>
        <router-link :to="`/kb/${article.id}`" class="read-more">Read More</router-link>
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
  }, 300); // Debounce for 300ms
};

onMounted(fetchArticles);
</script>

<style scoped>
.kb-container { max-width: 900px; margin: 20px auto; padding: 20px; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.btn-create { background-color: #17a2b8; color: white; padding: 8px 15px; text-decoration: none; border-radius: 5px; }
.search-bar input { width: 100%; padding: 10px; font-size: 1em; margin-bottom: 20px; }
.article-list { display: flex; flex-direction: column; gap: 20px; }
.article-item { padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
.article-item h2 { margin-top: 0; }
.read-more { display: inline-block; margin-top: 10px; color: #007bff; text-decoration: none; font-weight: bold; }
</style>