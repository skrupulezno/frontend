<template>
  <div class="photo-results-container">
    <div class="photo-editor">
      <div class="photo-controls">
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
        <button @click="cropPhoto">Обрезать</button>
        <button @click="zoomPhoto">Масштаб</button>
        <button @click="openSettings">Настройка</button>
      </div>
      <div class="photo-area">
        <img
          :src="currentPhoto.preview"
          alt="Photo"
          ref="image"
        />
      </div>
    </div>
    <div class="photo-response">
      <div class="container">
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
          <input v-model="value.inputValue" />
          <button
            class="delete-button"
            @click="deleteRow(value.key)"
          >
            ×
          </button>
        </div>
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
          <input v-model="newFields[key]" />
          <button
            class="delete-button"
            @click="deleteNewField(key)"
          >
            ×
          </button>
        </div>
      </div>
      <button
        class="table-button"
        @click=""
      >
        Экспорт в таблицы
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

import { usePhotoStore } from '../stores/photo.store';

const photoStore = usePhotoStore();
const photos = photoStore.photos;
const currentIndex = ref(0);
const image = ref(null);
const rotationAngle = ref(0);

const currentPhoto = computed(() => photos[currentIndex.value]);

const visiblePhotos = computed(() => {
  const start = Math.max(0, currentIndex.value - 3);
  const end = Math.min(photos.length, currentIndex.value + 4);
  return photos.slice(start, end);
});

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
  image.value.style.transform = `rotate(${rotationAngle.value}deg)`;
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
  image.value.style.clip = 'rect(50px, 150px, 150px, 50px)';
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

// Объект для хранения цветов ключей
const keyColors = reactive({});

// Функция для получения или назначения цвета ключу
function getColorForKey(key) {
  if (!keyColors[key]) {
    keyColors[key] = getRandomColor();
  }
  return keyColors[key];
}

const responseEntries = computed(() => {
  const entries = [];
  if (currentPhoto.value && currentPhoto.value.response) {
    for (const [key, value] of Object.entries(currentPhoto.value.response)) {
      entries.push({
        key,
        smallColor: getColorForKey(key),
        largeColor: getColorForKey(key),
        inputValue: value
      });
    }
  }
  return entries;
});

const newFields = reactive({
  product: '',
  inn: ''
});

function deleteRow(key) {
  delete currentPhoto.value.response[key];
}

function deleteNewField(key) {
  newFields[key] = '';
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
</script>

<style scoped>
.table-button {
}

.photo-response {
  padding: 35px 50px;
  width: 350px;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 15px;
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

.large-square {
  width: 24px;
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

.color-box {
  width: 20px;
  height: 20px;
  border-radius: 3px;
}

.label {
  flex: 1;
}

select {
  flex: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

button {
  border: none;
  font-size: 14px;
  color: #666462;
  background-color: transparent;
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
