<template>
  <div class="photo-results-container">
    <div class="photo-navigation">
      <button
        @click="prevPhoto"
        :disabled="currentIndex === 0"
      >
        Предыдущий
      </button>
      <span>{{ currentIndex + 1 }} / {{ photos.length }}</span>
      <button
        @click="nextPhoto"
        :disabled="currentIndex === photos.length - 1"
      >
        Следующий
      </button>
    </div>
    <div class="photo-editor">
      <div class="photo-area">
        <img
          :src="currentPhoto.preview"
          alt="Photo"
          ref="image"
        />
        <button @click="rotatePhoto">Повернуть</button>
      </div>
      <div class="photo-response">
        <h3>Результаты анализа</h3>
        <div v-if="currentPhoto.response">
          <table>
            <tr>
              <th>Параметр</th>
              <th>Значение</th>
            </tr>
            <tr
              v-for="(value, key) in currentPhoto.response"
              :key="key"
            >
              <td>{{ key }}</td>
              <td>{{ value }}</td>
            </tr>
          </table>
        </div>
        <div v-else>
          <p>Нет данных.</p>
        </div>
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

const currentPhoto = computed(() => photos[currentIndex.value]);

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
  const img = image.value;
  img.style.transform = `rotate(${(rotationAngle.value += 90)}deg)`;
}

const rotationAngle = ref(0);
</script>

<style scoped>
.photo-results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.photo-navigation {
  margin-bottom: 20px;
}

.photo-editor {
  display: flex;
  gap: 20px;
}

.photo-area {
  position: relative;
}

.photo-area img {
  max-width: 500px;
  max-height: 500px;
}

.photo-response {
  max-width: 300px;
}
</style>
