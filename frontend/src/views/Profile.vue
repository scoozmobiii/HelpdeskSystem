<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <div class="max-w-3xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">My Profile</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your personal information and password.</p>
      </div>
      
      <div v-if="loading" class="text-center text-gray-500 py-10">Loading profile...</div>
      <div v-else-if="user" class="space-y-8">
        
        <div class="bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <div class="flex items-center border-b pb-4 mb-6">
            <svg class="h-6 w-6 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <h2 class="text-xl font-semibold text-gray-800">Profile Information</h2>
          </div>
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="name" v-model="user.name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" v-model="user.email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div class="flex justify-end pt-2">
              <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition-colors">Save Profile</button>
            </div>
          </form>
        </div>

        <div class="bg-white p-6 sm:p-8 rounded-lg shadow-md">
           <div class="flex items-center border-b pb-4 mb-6">
            <svg class="h-6 w-6 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
            <h2 class="text-xl font-semibold text-gray-800">Change Password</h2>
          </div>
          <form @submit.prevent="changePassword" class="space-y-4">
            <div>
              <label for="oldPassword" class="block text-sm font-medium text-gray-700">Current Password</label>
              <input type="password" id="oldPassword" v-model="passwordForm.oldPassword" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
              <input type="password" id="newPassword" v-model="passwordForm.newPassword" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
             <div>
              <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input type="password" id="confirmNewPassword" v-model="passwordForm.confirmNewPassword" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div class="flex justify-end pt-2">
              <button type="submit" class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-5 rounded-lg transition-colors">Change Password</button>
            </div>
          </form>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 py-10">Could not load profile data.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../api/axios';
import { useAuthStore } from '../stores/authStore'; 

const user = ref(null);
const loading = ref(true);
const authStore = useAuthStore();

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: ''
});

onMounted(async () => {
  try {
    const response = await apiClient.get('/users/me');
    user.value = response.data;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  } finally {
    loading.value = false;
  }
});

const updateProfile = async () => {
  if (!user.value) return;
  try {
    const response = await apiClient.put('/users/me', {
      name: user.value.name,
      email: user.value.email,
    });
    
    if (response.data.token) {
      authStore.setToken(response.data.token);
    }
    
    alert('Profile updated successfully!');
  } catch (error) {
    alert('Failed to update profile.');
    console.error(error);
  }
};

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmNewPassword) {
    alert('New password and confirmation do not match.');
    return;
  }
  try {
    await apiClient.put('/users/me/password', {
        oldPassword: passwordForm.value.oldPassword,
        newPassword: passwordForm.value.newPassword
    });
    alert('Password changed successfully!');
    passwordForm.value.oldPassword = '';
    passwordForm.value.newPassword = '';
    passwordForm.value.confirmNewPassword = '';
  } catch (error) {
    alert(`Failed to change password: ${error.response?.data?.message || 'Please try again.'}`);
    console.error(error);
  }
};
</script>