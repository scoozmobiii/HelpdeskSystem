<template>
  <div class="management-container">
    <h1>User Management</h1>
    <div v-if="loading">Loading users...</div>
    <div v-else-if="error">{{ error }}</div>
    <table v-else class="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button @click="openEditModal(user)">Edit</button>
            <button @click="deleteUser(user.id)" class="btn-delete">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="isEditModalVisible" class="modal-overlay">
      <div class="modal-content">
        <h2>Edit User: {{ editingUser.name }}</h2>
        <form @submit.prevent="saveUser">
          <div class="form-group">
            <label>Name:</label>
            <input type="text" v-model="editingUser.name" required />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" v-model="editingUser.email" required />
          </div>
          <div class="form-group">
            <label>Role:</label>
            <select v-model="editingUser.role" required>
              <option value="user">User</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="submit">Save Changes</button>
            <button type="button" @click="closeEditModal">Cancel</button>
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
  editingUser.value = { ...user }; // Clone user object to avoid direct mutation
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
    fetchUsers(); // Refresh the list
  } catch (err) {
    alert('Failed to update user.');
    console.error(err);
  }
};

const deleteUser = async (userId) => {
  if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
    try {
      await apiClient.delete(`/users/${userId}`);
      alert('User deleted successfully!');
      fetchUsers(); // Refresh the list
    } catch (err) {
      alert(`Failed to delete user. ${err.response?.data?.message || ''}`);
      console.error(err);
    }
  }
};
</script>

<style scoped>
.management-container { max-width: 1000px; margin: 20px auto; padding: 20px; }
.user-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
.user-table th, .user-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
.user-table th { background-color: #f2f2f2; }
.user-table button { margin-right: 5px; }
.btn-delete { background-color: #dc3545; color: white; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; }
.modal-content { background: white; padding: 20px; border-radius: 5px; width: 400px; }
.form-group { margin-bottom: 15px; }
.modal-actions { margin-top: 20px; text-align: right; }
</style>