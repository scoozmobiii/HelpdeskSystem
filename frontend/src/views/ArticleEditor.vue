<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
          {{ isEditing ? 'Edit Article' : 'Create New Article' }}
        </h1>
        <form @submit.prevent="saveArticle" class="space-y-6">
          
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input 
              type="text" 
              id="title" 
              v-model="title" 
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Content</label>
            <div class="mt-1">
              <QuillEditor 
                theme="snow" 
                toolbar="full" 
                v-model:content="content" 
                contentType="html"
                class="bg-white"
              />
            </div>
          </div>

          <div class="flex justify-end gap-4 pt-4">
             <router-link 
                :to="isEditing ? `/kb/${articleId}` : '/kb'"
                class="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-all"
              >
              Cancel
            </router-link>
            <button 
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {{ isEditing ? 'Save Changes' : 'Create Article' }}
            </button>
          </div>
        </form>
      </div>
    </div>
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
      await apiClient.put(`/kb/${articleId}`, payload);
      alert('Article updated successfully!');
      router.push(`/kb/${articleId}`);
    } else {
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

<style>
.ql-toolbar.ql-snow {
  border-top-left-radius: 0.375rem; /* rounded-md */
  border-top-right-radius: 0.375rem; /* rounded-md */
  border: 1px solid #d1d5db; /* border-gray-300 */
}
.ql-container.ql-snow {
  border-bottom-left-radius: 0.375rem; /* rounded-md */
  border-bottom-right-radius: 0.375rem; /* rounded-md */
  border: 1px solid #d1d5db; /* border-gray-300 */
  border-top: 0;
  min-height: 250px;
}
</style>