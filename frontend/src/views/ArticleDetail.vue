<template>
  <div class="article-container">
    <div v-if="loading">Loading...</div>
    <div v-else-if="article">
      <div class="header">
        <h1>{{ article.title }}</h1>
        <div>
          <router-link
            v-if="authStore.user?.role === 'staff' || authStore.user?.role === 'admin'"
            :to="`/kb/${articleId}/edit`"
            class="btn-edit"
          >
            Edit
          </router-link>
          <button
            v-if="authStore.user?.role === 'staff' || authStore.user?.role === 'admin'"
            @click="deleteArticle"
            class="btn-delete"
          >
            Delete
          </button>
        </div>
      </div>
      <div class="article-content" v-html="article.content"></div>
    </div>
    <div v-else>Article not found.</div>
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
    console.error(error);
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

<style scoped>
.article-container { max-width: 800px; margin: 20px auto; padding: 20px; }
.header { display: flex; justify-content: space-between; align-items: center; }
.article-content { margin-top: 20px; line-height: 1.6; }
.btn-edit { background: #ffc107; padding: 8px 12px; border-radius: 5px; color: black; text-decoration: none; margin-right: 10px; }
.btn-delete { background: #dc3545; color: white; }
</style>