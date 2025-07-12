<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-200 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Helpdesk Login
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sign in to continue
        </p>
      </div>
      <form class="mt-8" @submit.prevent="handleLogin">
        
        <div class="relative mb-4">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input 
            id="email-address" 
            v-model="email" 
            type="email" 
            required 
            class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm" 
            placeholder="Email address"
          >
        </div>

        <div class="relative mb-6">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input 
            id="password" 
            v-model="password" 
            :type="showPassword ? 'text' : 'password'"
            required 
            class="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm" 
            placeholder="Password"
          >
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button type="button" @click="togglePasswordVisibility" class="focus:outline-none">
                  <svg v-if="!showPassword" class="h-6 w-6 text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <svg v-else class="h-6 w-6 text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
              </button>
          </div>
        </div>

        <p v-if="errorMessage" class="text-center text-sm text-red-600">
          {{ errorMessage }}
        </p>

        <div>
          <button 
            type="submit" 
            class="mt-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition-transform duration-300"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'LOGGING IN...' : 'LOGIN' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Script ไม่มีการเปลี่ยนแปลง
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);
const showPassword = ref(false);
const router = useRouter();
const authStore = useAuthStore();

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  errorMessage.value = '';
  isSubmitting.value = true;
  try {
    const response = await axios.post('http://localhost:5000/api/users/login', {
      email: email.value,
      password: password.value,
    });
    
    authStore.setToken(response.data.token); 

    if (authStore.user?.role === 'staff' || authStore.user?.role === 'admin') {
      router.push('/staff/dashboard');
    } else {
      router.push('/dashboard');
    }

  } catch (error) {
    console.error('Login failed:', error);
    errorMessage.value = 'Login failed. Please check your credentials.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>