<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard - System Summary</h1>
    <div v-if="loading">Loading report...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div class="summary-cards">
        <div class="card">
          <h2>{{ summary.totalTickets }}</h2>
          <p>Total Tickets</p>
        </div>
        <div class="card">
          <h2>{{ summary.statusCounts?.Resolved || 0 }}</h2>
          <p>Resolved Tickets</p>
        </div>
        <div class="card">
          <h2>{{ summary.statusCounts?.New || 0 }}</h2>
          <p>New Tickets</p>
        </div>
        <div class="card">
          <h2>{{ summary.statusCounts?.['In Progress'] || 0 }}</h2>
          <p>In Progress</p>
        </div>
      </div>
      <div class="chart-container">
        <h3>Tickets Created (Last 7 Days)</h3>
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
  return {
    labels: summary.value.dailyCounts.map(d => new Date(d.date).toLocaleDateString('en-CA')),
    datasets: [
      {
        label: 'Tickets Created',
        backgroundColor: '#42b983',
        borderColor: '#42b983',
        data: summary.value.dailyCounts.map(d => d.count),
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
.admin-dashboard { max-width: 1200px; margin: 20px auto; padding: 20px; }
.summary-cards { display: flex; gap: 20px; justify-content: space-around; margin-bottom: 40px; }
.card { background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; width: 200px; border: 1px solid #dee2e6;}
.card h2 { margin: 0; font-size: 2.5em; }
.card p { margin: 5px 0 0; color: #6c757d; }
.chart-container { position: relative; height: 400px; }
</style>