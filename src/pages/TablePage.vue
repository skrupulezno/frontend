<template>
  <div class="export-table-container">
    <h1>Экспортированные таблицы</h1>
    <table>
      <thead>
        <tr>
          <th>Фото ID</th>
          <th
            v-for="column in columns"
            :key="column"
          >
            {{ getLabel(column) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(photo, index) in photos"
          :key="index"
        >
          <td>{{ index + 1 }}</td>
          <td
            v-for="column in columns"
            :key="column"
          >
            {{ photo.response[column] || '' }}
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="exportToExcel">Экспорт в Excel</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import * as XLSX from 'xlsx';

import { usePhotoStore } from '../stores/photo.store';

const photoStore = usePhotoStore();
const photos = photoStore.photos;

const columns = computed(() => {
  const keysSet = new Set();
  photos.forEach(photo => {
    if (photo.response) {
      Object.keys(photo.response).forEach(key => keysSet.add(key));
    }
  });
  return Array.from(keysSet);
});

function getLabel(key) {
  const labels = {
    total: 'Сумма',
    date: 'Дата',
    address: 'Адрес',
    company: 'Компания',
    product: 'Товар',
    inn: 'ИНН'
  };
  return labels[key] || key;
}

function exportToExcel() {
  const data = [];

  data.push(['Фото ID', ...columns.value.map(getLabel)]);

  photos.forEach((photo, index) => {
    const row = [index + 1];
    columns.value.forEach(col => {
      row.push(photo.response[col] || '');
    });
    data.push(row);
  });

  // Create Worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Create Workbook and Append Worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Photos');

  // Export to Excel File
  XLSX.writeFile(workbook, 'photos_export.xlsx');
}
</script>

<style scoped>
.export-table-container {
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f5f5f5;
}

button {
  padding: 10px 20px;
  background-color: #ff0032;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #e60029;
}
</style>
