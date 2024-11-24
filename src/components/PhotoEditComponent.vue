<template>
  <div class="photo-results-container">
    <div class="photo-editor">
      <div class="photo-controls">
        <!-- Existing Buttons -->
        <button
          @click="nextPhoto"
          :disabled="currentIndex === photos.length - 1"
        >
          Вперед
        </button>
        <button
          @click="prevPhoto"
          :disabled="currentIndex === 0"
        >
          Назад
        </button>
        <button @click="rotatePhoto">Повернуть</button>
        <button @click="savePhoto">Сохранить</button>

        <!-- Photo Navigation -->
        <div class="photo-navigation">
          <button
            @click="prevPhoto"
            :disabled="currentIndex === 0"
            class="arrow-button"
          >
            &#8592;
          </button>
          <div class="photo-circles">
            <span
              v-for="(photo, index) in visiblePhotos"
              :key="index"
              :class="['photo-circle', { active: index === currentIndex }]"
              @click="goToPhoto(index)"
            >
              {{ index + 1 }}
            </span>
          </div>
          <button
            @click="nextPhoto"
            :disabled="currentIndex === photos.length - 1"
            class="arrow-button"
          >
            &#8594;
          </button>
        </div>

        <!-- More Buttons -->
        <button @click="cropPhoto">Обрезать</button>
        <button @click="zoomPhoto">Масштаб</button>
        <button @click="openSettings">Настройка</button>
      </div>

      <!-- Photo Display Area -->
      <div class="photo-area">
        <img
          :src="currentPhoto.preview"
          alt="Photo"
          ref="image"
        />
      </div>
    </div>

    <!-- Response Entries and Export Button -->
    <div class="photo-response">
      <div class="container">
        <!-- Existing Response Rows -->
        <div
          class="row"
          v-for="(value, index) in responseEntries"
          :key="index"
        >
          <div
            class="small-square"
            :style="{ backgroundColor: value.smallColor }"
          ></div>
          <div class="label">{{ getLabel(value.key) }}</div>
          <input v-model="currentPhoto.response[value.key]" />
          <button
            class="delete-button"
            @click="deleteRow(value.key)"
          >
            ×
          </button>
        </div>

        <!-- Predefined Fields: Product and INN -->
        <div
          class="row"
          v-for="key in ['product', 'inn']"
          :key="key"
        >
          <div
            class="small-square"
            :style="{ backgroundColor: getColorForKey(key) }"
          ></div>
          <div class="label">{{ getLabel(key) }}</div>
          <input v-model="currentPhoto.response[key]" />
          <button
            class="delete-button"
            @click="deleteNewField(key)"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Export Button -->
      <button
        class="table-button"
        @click="exportTables"
      >
        Экспорт в таблицы
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { usePhotoStore } from '../stores/photo.store';

// Initialize Pinia Store and Router
const photoStore = usePhotoStore();
const router = useRouter();

// Reactive Variables
const photos = photoStore.photos;
const currentIndex = ref(0);
const image = ref(null);
const rotationAngle = ref(0);

// Computed Properties
const currentPhoto = computed(() => photos[currentIndex.value]);

const visiblePhotos = computed(() => {
  const start = Math.max(0, currentIndex.value - 3);
  const end = Math.min(photos.length, currentIndex.value + 4);
  return photos.slice(start, end);
});

const responseEntries = computed(() => {
  const entries = [];
  if (currentPhoto.value && currentPhoto.value.response) {
    for (const [key, value] of Object.entries(currentPhoto.value.response)) {
      entries.push({
        key,
        smallColor: getColorForKey(key)
      });
    }
  }
  return entries;
});

// Methods
function nextPhoto() {
  if (currentIndex.value < photos.length - 1) {
    currentIndex.value++;
  }
}

function prevPhoto() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

function rotatePhoto() {
  rotationAngle.value += 90;
  if (image.value) {
    image.value.style.transform = `rotate(${rotationAngle.value}deg)`;
  }
}

function zoomPhoto() {
  // Placeholder for zoom functionality
}

function openSettings() {
  // Placeholder for settings functionality
}

function savePhoto() {
  // Placeholder for save functionality
}

function cropPhoto() {
  // Basic crop functionality
  if (image.value) {
    image.value.style.clip = 'rect(50px, 150px, 150px, 50px)';
  }
}

function goToPhoto(index) {
  currentIndex.value = index;
}

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

// Color Management
const keyColors = reactive({});

function getColorForKey(key) {
  if (!keyColors[key]) {
    keyColors[key] = getRandomColor();
  }
  return keyColors[key];
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Row Deletion Methods
function deleteRow(key) {
  photoStore.deleteResponseKey(currentIndex.value, key);
}

function deleteNewField(key) {
  photoStore.updateResponse(currentIndex.value, key, '');
}

// Navigation to Export Page
function exportTables() {
  router.push('/export-table');
}
</script>

<style scoped>
.table-button {
  background-color: #ff0032;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  margin-top: 167px;
  font-size: 20px;
  font-weight: 500;
  border-radius: 4px;
  color: #fff;
  width: 224px;
  height: 46px;
}

.photo-response {
  padding: 35px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 350px;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.small-square {
  width: 12px;
  height: 24px;
  border-radius: 3px;
}

.label {
  flex: 1;
}

input {
  flex: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.delete-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  color: #666462;
}

.delete-button:hover {
  color: red;
}

.photo-editor {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}

.photo-results-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: calc(100vh - 70px);
}

.photo-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 8px;
  height: 50px;
}

.photo-navigation {
  display: flex;
  width: 300px;
  justify-content: center;
  align-items: center;
}

.arrow-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.arrow-button:disabled {
  color: gray;
  cursor: not-allowed;
}

.photo-circles {
  display: flex;
  gap: 8px;
}

.photo-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.photo-circle.active {
  background-color: #ff0032;
  color: white;
}

.photo-area {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  background-color: #ffffff;
}

.photo-area img {
  max-width: 500px;
  max-height: 500px;
  transition: transform 0.3s ease;
}
</style>
