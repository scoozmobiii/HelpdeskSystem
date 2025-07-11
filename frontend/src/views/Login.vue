<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  errorMessage.value = '';
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
  }
};
</script>

<style scoped>
.login-container { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; }
.form-group { margin-bottom: 15px; }
label { display: block; margin-bottom: 5px; }
input { width: 100%; padding: 8px; box-sizing: border-box; }
.error-message { color: red; margin-bottom: 15px; }
button { width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
button:disabled { background-color: #ccc; }
</style>