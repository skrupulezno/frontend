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
      <div v-if="currentPhoto.response">
        <table>
          <tr
            v-for="(value, key) in currentPhoto.response"
            :key="key"
          >
            <td>
              <div class="color"></div>
              {{ key }}
            </td>
            <td>{{ value }}</td>
          </tr>
        </table>
      </div>
      <div v-else>
        <p>Нет данных.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

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
</script>

<style scoped>
.photo-response {
  padding: 35px 50px;
  width: 350px;
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
