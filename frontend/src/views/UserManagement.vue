<template>
  <div class="management-container container mx-auto p-4 sm:p-6 lg:p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">User Management</h1>
    </div>

    <div v-if="loading" class="text-center text-gray-500 py-10">Loading users...</div>
    <div v-else-if="error" class="text-center text-red-500 py-10">{{ error }}</div>
    
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-700">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">ID</th>
              <th scope="col" class="px-6 py-3">Name</th>
              <th scope="col" class="px-6 py-3">Email</th>
              <th scope="col" class="px-6 py-3">Role</th>
              <th scope="col" class="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="bg-white border-b hover:bg-gray-50">
              <td class="px-6 py-4 font-medium text-gray-900">{{ user.id }}</td>
              <td class="px-6 py-4">{{ user.name }}</td>
              <td class="px-6 py-4">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full" :class="roleClass(user.role)">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <button @click="openEditModal(user)" class="font-medium text-blue-600 hover:underline mr-3">Edit</button>
                <button @click="deleteUser(user.id)" class="font-medium text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="isEditModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Edit User: {{ editingUser.name }}</h2>
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name:</label>
            <input type="text" v-model="editingUser.name" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email:</label>
            <input type="email" v-model="editingUser.email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Role:</label>
            <select v-model="editingUser.role" required class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="user">User</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="closeEditModal" class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../api/axios';

const users = ref([]);
const loading = ref(true);
const error = ref(null);

const isEditModalVisible = ref(false);
const editingUser = ref(null);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await apiClient.get('/users');
    users.value = response.data;
  } catch (err) {
    error.value = 'Failed to load users.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUsers);

const openEditModal = (user) => {
  editingUser.value = { ...user };
  isEditModalVisible.value = true;
};

const closeEditModal = () => {
  isEditModalVisible.value = false;
  editingUser.value = null;
};

const saveUser = async () => {
  if (!editingUser.value) return;
  try {
    await apiClient.put(`/users/${editingUser.value.id}`, editingUser.value);
    alert('User updated successfully!');
    closeEditModal();
    fetchUsers();
  } catch (err) {
    alert('Failed to update user.');
    console.error(err);
  }
};

const deleteUser = async (userId) => {
  if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
    try {
      await apiClient.delete(`/users/${userId}`);
      alert('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      alert(`Failed to delete user. ${err.response?.data?.message || ''}`);
      console.error(err);
    }
  }
};

const roleClass = (role) => {
    const r = role ? role.toLowerCase() : '';
    if (r === 'admin') return 'bg-red-100 text-red-800';
    if (r === 'staff') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
}
</script>
