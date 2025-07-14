<template>
  <div class="admin-dashboard container mx-auto p-4 sm:p-6 lg:p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">System Report</h1>
      <p class="mt-1 text-sm text-gray-500">An overview of helpdesk activity.</p>
    </div>

    <div v-if="loading" class="text-center text-gray-500 py-10">Loading report...</div>
    <div v-else-if="error" class="text-center text-red-500 py-10">{{ error }}</div>
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md text-center">
          <p class="text-sm font-medium text-gray-500">Total Tickets</p>
          <p class="text-3xl font-bold text-gray-900">{{ summary.totalTickets }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md text-center">
          <p class="text-sm font-medium text-gray-500">New</p>
          <p class="text-3xl font-bold text-blue-600">{{ summary.statusCounts?.New || 0 }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md text-center">
          <p class="text-sm font-medium text-gray-500">In Progress</p>
          <p class="text-3xl font-bold text-yellow-500">{{ summary.statusCounts?.['In Progress'] || 0 }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md text-center">
          <p class="text-sm font-medium text-gray-500">Resolved</p>
          <p class="text-3xl font-bold text-green-600">{{ summary.statusCounts?.Resolved || 0 }}</p>
        </div>
      </div>
      
      <div class="chart-container bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">Tickets Created (Last 7 Days)</h3>
        <Line v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import apiClient from '../api/axios';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const summary = ref({});
const loading = ref(true);
const error = ref(null);

const chartData = computed(() => {
  if (!summary.value.dailyCounts) {
    return { labels: [], datasets: [] };
  }
  const labels = [];
  const data = [];
  // Create a map of dates to counts
  const countsByDate = new Map(summary.value.dailyCounts.map(d => [new Date(d.date).toLocaleDateString('en-CA'), d.count]));
  
  // Create labels for the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const formattedDate = date.toLocaleDateString('en-CA');
    labels.push(formattedDate);
    data.push(countsByDate.get(formattedDate) || 0); // Use count if exists, otherwise 0
  }

  return {
    labels,
    datasets: [
      {
        label: 'Tickets Created',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
        data,
      },
    ],
  };
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

onMounted(async () => {
  try {
    const response = await apiClient.get('/reports/summary');
    summary.value = response.data;
  } catch (err) {
    error.value = 'Failed to load report data.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 40vh; /* 40% of the viewport height */
  width: 100%;
}
</style>