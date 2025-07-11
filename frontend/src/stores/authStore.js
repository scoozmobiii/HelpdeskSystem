import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'));
  const user = ref(token.value ? jwtDecode(token.value).user : null);
  const router = useRouter();

  // Getters
  const isAuthenticated = computed(() => !!token.value);

  // Actions
  function setToken(newToken) {
    localStorage.setItem('token', newToken);
    token.value = newToken;
    if (newToken) {
      user.value = jwtDecode(newToken).user;
    } else {
      user.value = null;
    }
  }

  function logout() {
    localStorage.removeItem('token');
    token.value = null;
    user.value = null;
    router.push('/login');
  }

  return { token, user, isAuthenticated, setToken, logout };
});