<template>
  <div id="app" class="bg-gray-50 min-h-screen">
    <header v-if="authStore.isAuthenticated" class="bg-white shadow-sm sticky top-0 z-50">
      <nav class="container mx-auto px-4 lg:px-6 py-3">
        <div class="flex flex-wrap justify-between items-center">
          <router-link to="/" class="flex items-center">
            <img src="@/assets/images/logo.svg" class="h-10 mr-3" alt="Helpdesk Logo" />
          </router-link>
          
          <div class="flex items-center lg:order-2 gap-4">
            <div class="hidden lg:flex items-center gap-4">
              <RouterLink to="/kb" class="nav-link">Knowledge Base</RouterLink>
              <RouterLink v-if="authStore.user?.role === 'admin'" to="/admin/users" class="nav-link">User Management</RouterLink>
              <RouterLink v-if="authStore.user?.role === 'admin'" to="/admin/dashboard" class="nav-link">Reporting</RouterLink>
            </div>

            <div class="relative" ref="profileMenu">
              <button @click="toggleProfileMenu" class="flex text-sm bg-gray-200 rounded-full focus:outline-none focus:ring-4 focus:ring-gray-300">
                <span class="sr-only">Open user menu</span>
                <div class="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                  {{ authStore.user?.name?.charAt(0).toUpperCase() }}
                </div>
              </button>
              
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="isProfileMenuOpen" class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 origin-top-right ring-1 ring-black ring-opacity-5 p-2">
                  
                  <div class="flex items-center p-2 mb-2">
                    <div class="flex-shrink-0">
                      <div class="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                        {{ authStore.user?.name?.charAt(0).toUpperCase() }}
                      </div>
                    </div>
                    <div class="ml-3 min-w-0">
                      <p class="text-sm font-semibold text-gray-900 truncate">{{ authStore.user.name }}</p>
                      <p class="text-sm text-gray-500">{{ authStore.user.role }}</p>
                    </div>
                  </div>
                  
                  <div class="border-t border-gray-100"></div>

                  <div class="py-1">
                    <router-link to="/profile" class="menu-item-wrapper" @click="closeProfileMenu">
                      <div class="flex items-center gap-3">
                        <svg class="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        <span>View Profile</span>
                      </div>
                    </router-link>
                  </div>
                  
                  <div class="py-1">
                    <a href="#" @click.prevent="handleLogout" class="menu-item-wrapper">
                      <div class="flex items-center gap-3">
                        <svg class="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        <span>Sign out</span>
                      </div>
                    </a>
                  </div>

                </div>
              </transition>
            </div>
          </div>
        </div>
      </nav>
    </header>
    
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
// Script ไม่มีการเปลี่ยนแปลง
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterView, RouterLink } from 'vue-router';
import { useAuthStore } from './stores/authStore';
const authStore = useAuthStore();
const isProfileMenuOpen = ref(false);
const profileMenu = ref(null);
const toggleProfileMenu = () => { isProfileMenuOpen.value = !isProfileMenuOpen.value; };
const closeProfileMenu = () => { isProfileMenuOpen.value = false; };
const handleLogout = () => { closeProfileMenu(); authStore.logout(); };
const handleClickOutside = (event) => { if (profileMenu.value && !profileMenu.value.contains(event.target)) { closeProfileMenu(); } };
onMounted(() => { document.addEventListener('click', handleClickOutside); });
onUnmounted(() => { document.removeEventListener('click', handleClickOutside); });
</script>

<style>
.nav-link {
  position: relative;
  font-size: 1rem; 
  font-weight: 500;
  color: #4B5563; 
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  text-decoration: none;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  display: block;
  margin-top: 5px;
  right: 0;
  background: #4B5563; 
  transition: width 0.3s ease;
  -webkit-transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
  left: 0;
  background-color: #4B5563; 
}

.menu-item-wrapper {
  @apply block w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900;
}
</style>