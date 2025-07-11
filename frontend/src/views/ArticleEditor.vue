<template>
  <div class="editor-container">
    <h1>{{ isEditing ? 'Edit Article' : 'Create New Article' }}</h1>
    <form @submit.prevent="saveArticle">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" id="title" v-model="title" required />
      </div>
      <div class="form-group">
        <label>Content</label>
        <QuillEditor theme="snow" toolbar="full" v-model:content="content" contentType="html" />
      </div>
      <button type="submit">{{ isEditing ? 'Save Changes' : 'Create Article' }}</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import apiClient from '../api/axios';

const route = useRoute();
const router = useRouter();
const articleId = route.params.id;

const title = ref('');
const content = ref('');

const isEditing = computed(() => !!articleId);

onMounted(async () => {
  if (isEditing.value) {
    // Edit mode: fetch existing article
    try {
      const response = await apiClient.get(`/kb/${articleId}`);
      title.value = response.data.title;
      content.value = response.data.content;
    } catch (error) {
      console.error('Failed to fetch article for editing:', error);
      alert('Could not load article data.');
    }
  }
});

const saveArticle = async () => {
  try {
    const payload = { title: title.value, content: content.value };
    if (isEditing.value) {
      // Update existing
      await apiClient.put(`/kb/${articleId}`, payload);
      alert('Article updated successfully!');
      router.push(`/kb/${articleId}`);
    } else {
      // Create new
      const response = await apiClient.post('/kb', payload);
      alert('Article created successfully!');
      router.push(`/kb/${response.data.id}`);
    }
  } catch (error) {
    console.error('Failed to save article:', error);
    alert('Error saving article.');
  }
};
</script>

<style scoped>
.editor-container { max-width: 900px; margin: 20px auto; padding: 20px; }
.form-group { margin-bottom: 20px; }
input { width: 100%; padding: 10px; box-sizing: border-box; }
/* You might need to adjust the editor's style if it overflows */
</style>