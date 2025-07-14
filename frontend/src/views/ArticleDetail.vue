<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <div class="max-w-3xl mx-auto">
      <div v-if="loading" class="text-center text-gray-500 py-10">Loading...</div>
      <div v-else-if="article" class="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        
        <div class="border-b pb-4 mb-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">{{ article.title }}</h1>
            <router-link 
              to="/kb" 
              class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors mt-2 sm:mt-0"
            >
              &larr; Back to Knowledge Base
            </router-link>
          </div>
          <p class="text-xs text-gray-400 mt-2">Last updated: {{ new Date(article.updated_at).toLocaleString() }}</p>
        </div>

        <div class="article-content" v-html="article.content"></div>
        
        <div v-if="authStore.user?.role === 'staff' || authStore.user?.role === 'admin'" class="mt-8 pt-6 border-t flex justify-end gap-3">
          <router-link
            :to="`/kb/${articleId}/edit`"
            class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors"
          >
            Edit
          </router-link>
          <button
            @click="deleteArticle"
            class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 py-10">Article not found.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '../api/axios';
import { useAuthStore } from '../stores/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const article = ref(null);
const loading = ref(true);
const articleId = route.params.id;

onMounted(async () => {
  try {
    const response = await apiClient.get(`/kb/${articleId}`);
    article.value = response.data;
  } catch (error) {
    console.error('Failed to fetch article details:', error);
  } finally {
    loading.value = false;
  }
});

const deleteArticle = async () => {
  if (confirm('Are you sure you want to delete this article?')) {
    try {
      await apiClient.delete(`/kb/${articleId}`);
      alert('Article deleted successfully.');
      router.push('/kb');
    } catch (error) {
      alert('Failed to delete article.');
    }
  }
};
</script>

<style>
.article-content h1, .article-content h2, .article-content h3 {
  margin-bottom: 0.75em;
  font-weight: 700;
  line-height: 1.2;
}
.article-content h1 { font-size: 1.875rem; }
.article-content h2 { font-size: 1.5rem; }
.article-content h3 { font-size: 1.25rem; }

.article-content p {
  margin-bottom: 1em;
}
.article-content ul, .article-content ol {
  padding-left: 1.75em;
  margin-bottom: 1em;
}
.article-content ul { list-style-type: disc; }
.article-content ol { list-style-type: decimal; }

.article-content a {
  color: #3b82f6;
  text-decoration: underline;
}
.article-content pre {
    background-color: #f3f4f6;
    color: #111827;
    padding: 1em;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin-bottom: 1em;
}
</style>