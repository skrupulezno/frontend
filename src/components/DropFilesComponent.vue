<template>
  <div
    class="photo-uploader-container"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <div class="photo-uploader">
      <input
        ref="fileInput"
        type="file"
        multiple
        @change="handleFileUpload"
        hidden
      />
      <template v-if="!photos.length">
        <div class="control-container">
          <img
            src="/src/assets/upload.png"
            alt=""
            class="upload-icon"
          />
          <button
            class="select-files-button"
            @click="triggerFileUpload"
          >
            + Выбрать
          </button>
          <div class="line">или</div>
          <div class="info">Перетащите или вставьте изображение</div>
        </div>
        <div class="photo-image-info">
          Файлы, которые поддерживаются: JPG, JPEG, PNG, PDF, HEIC, HEIF, WEBP
        </div>
      </template>

      <template v-else>
        <div class="photo-list">
          <h4>{{ photos.length }} Файла</h4>
          <ul>
            <li
              v-for="(photo, index) in photos"
              :key="index"
              class="items"
              :class="{ selected: selectedIndexes.includes(index) }"
              @click="toggleSelection(index)"
            >
              <div class="photo-info">
                <img
                  :src="photo.preview || '/images/logo.svg'"
                  alt="Uploaded photo"
                />
              </div>

              <div
                v-if="photo.error"
                class="photo-error"
              >
                Ошибка при загрузке файла.
              </div>
              <div class="photo-progress">
                <span>{{ photo.name }}</span>
                <span class="progress">{{ photo.progress }}%</span>
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: photo.progress + '%' }"
                  ></div>
                </div>
              </div>
              <div class="photo-actions">
                <button
                  class="delete"
                  @click.stop="deletePhoto(index)"
                >
                  <div class="x">+</div>
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div class="photo-list-controls">
          <button
            class="select-files-button"
            @click="triggerFileUpload"
          >
            + Выбрать
          </button>
          <button
            class="select-files-button"
            @click="handleConvert"
          >
            Конвертировать
          </button>
        </div>
      </template>
    </div>

    <!-- Лоадер -->
    <div
      v-if="isLoading"
      class="loader-overlay"
    >
      <div class="loader"></div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { usePhotoStore } from '../stores/photo.store';

const photoStore = usePhotoStore();
const { photos } = storeToRefs(photoStore);
const selectedIndexes = ref([]);
const isDragging = ref(false);
const fileInput = ref(null);
const router = useRouter();

// Новое состояние для лоадера
const isLoading = ref(false);

const supportedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

function handleFileUpload(event) {
  const files = Array.from(event.target.files);
  processFiles(files);
  event.target.value = null;
}

function processFiles(files) {
  files.forEach(file => {
    if (!supportedTypes.includes(file.type)) {
      alert(`Файл ${file.name} не поддерживается.`);
      return;
    }
    const reader = new FileReader();
    const photo = reactive({
      name: file.name,
      preview: '',
      progress: 0,
      file,
      error: false,
      response: null
    });
    photos.value.push(photo);

    reader.onload = e => {
      photo.preview = e.target.result;
    };

    reader.onerror = e => {
      console.error('Ошибка при чтении файла:', e);
      photo.error = true;
    };

    reader.readAsDataURL(file);

    let progress = 0;
    const progressInterval = setInterval(() => {
      if (photo.error) {
        clearInterval(progressInterval);
        return;
      }
      progress += 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
      }
      photo.progress = progress;
    }, 50);
  });
}

function triggerFileUpload() {
  fileInput.value.click();
}

async function handleConvert() {
  isLoading.value = true; // Начало загрузки
  try {
    for (const photo of photos.value) {
      const formData = new FormData();
      formData.append('file', photo.file);

      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/predict/',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        photo.response = response.data;
      } catch (error) {
        console.error('Error uploading photo:', error);
        photo.error = true;
      }
    }

    router.push({ name: 'PhotoEditorPage' });
  } finally {
    isLoading.value = false; // Завершение загрузки
  }
}

function handleDragOver() {
  isDragging.value = true;
}

function handleDragLeave() {
  isDragging.value = false;
}

function handleDrop(event) {
  const files = Array.from(event.dataTransfer.files);
  processFiles(files);
  isDragging.value = false;
}

function toggleSelection(index) {
  if (selectedIndexes.value.includes(index)) {
    selectedIndexes.value = selectedIndexes.value.filter(i => i !== index);
  } else {
    selectedIndexes.value.push(index);
  }
}

function deletePhoto(index) {
  photos.value.splice(index, 1);
  selectedIndexes.value = selectedIndexes.value.filter(i => i !== index);
}
</script>

<style scoped>
.x {
  color: white;
  font-size: 25px;
  transform: rotate(45deg);
  transform-origin: center;
  font-weight: 600px;
  line-height: 15px;
  position: relative;
  left: -1px;
  top: -1px;
}

.delete {
  width: 30px;
  height: 30px;
  position: relative;
}
.progress {
  width: 30px !important;
}
.photo-uploader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px dashed #454545;
  background-color: #fff;
  max-width: 1420px;
  min-width: 1200px;
  min-height: 710px;
  border-radius: 30px;
  position: relative;
}

.photo-uploader-container.dragging {
  background-color: #e0f7fa;
  border-color: #3e6863;
}

.photo-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  flex: 1;
}

.control-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: center;
  margin-top: 182px;
}

.upload-icon {
  width: 230px;
  height: 184px;
}

.select-files-button {
  width: 230px;
  height: 46px;
  margin-top: 30px;
  background-color: #ff0032;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.select-files-button:hover {
  background-color: #d7052f;
}

.line {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.line::before,
.line::after {
  content: '';
  display: block;
  width: 91px;
  height: 2px;
  background-color: #454545;
}

.info {
  margin-top: 30px;
}

.photo-image-info {
  align-self: self-end;
  margin-bottom: 32px;
}

.photo-list {
  width: 100%;
  height: 100%;
}

.photo-list h4 {
  margin-left: 20px;
}

.photo-list ul {
  list-style: none;
  padding: 0;
  max-height: 500px; /* Добавлено */
  overflow-y: auto; /* Добавлено */
}

.photo-list li {
  display: flex;
  flex-direction: row;
  padding: 10px;
  margin: 10px 20px;
  position: relative;
}

.photo-list li.selected {
  background-color: #e0f7fa;
}

.photo-info {
  display: flex;
  background-color: D9D9D9;
  width: 200px;
  height: 120px;
  border-radius: 30px;

  align-items: center;
}

.photo-list li img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 5px;
}

.photo-list li span {
}

.photo-actions {
  display: flex;
  align-items: center;
  margin-left: 30px;
}

.photo-list li button {
  background: #ff5252;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 3px;
}

.photo-list li button:hover {
  background: #ff1744;
}

.photo-progress {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: start;
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 5px;
}

.progress-fill {
  background-color: #f44336;
}

.progress-fill {
  height: 100%;
  background-color: #ff0032;
  transition: width 0.2s ease;
}

.photo-progress progress {
  display: flex;
  width: 100%;
  margin-right: 10px;
}

progress::-webkit-progress-bar {
  background-color: #f3f3f3; /* Цвет фона всего прогресс-бара */
}

progress::-webkit-progress-value {
  background-color: #4caf50; /* Цвет заполненной части прогресс-бара */
}

progress::-moz-progress-bar {
  background-color: #4caf50; /* Цвет заполненной части прогресс-бара */
}

.photo-progress span {
  width: 30px !important;
  text-align: right;
}

.photo-error {
  color: red;
  margin-top: 10px;
}

.photo-list-controls {
  display: flex;
  gap: 400px;
  justify-content: space-between;
  padding-bottom: 30px;
}

.custom-file-input {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border: 2px dashed #ccc;
  border-radius: 10px;
  background-color: #f9f9f9 !important;
  text-align: center;
  color: #888;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.custom-file-input.dragging {
  background-color: #e0f7fa;
  color: #00796b;
}

/* Стиль для лоадер оверлея */
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Полупрозрачный фон */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Поверх всех элементов */
}

/* Стиль для самого лоадера (спиннер) */

/* HTML: <div class="loader"></div> */
.loader {
  width: 90px;
  height: 14px;
  box-shadow: 0 3px 0 #fff;
  position: relative;
  clip-path: inset(-40px 0 -5px);
}
.loader:before {
  content: '';
  position: absolute;
  inset: auto calc(50% - 17px) 0;
  height: 50px;
  --g: no-repeat linear-gradient(#ccc 0 0);
  background: var(--g), var(--g), var(--g), var(--g);
  background-size: 16px 14px;
  animation:
    l7-1 2s infinite linear,
    l7-2 2s infinite linear;
}
@keyframes l7-1 {
  0%,
  100% {
    background-position:
      0 -50px,
      100% -50px;
  }
  17.5% {
    background-position:
      0 100%,
      100% -50px,
      0 -50px,
      100% -50px;
  }
  35% {
    background-position:
      0 100%,
      100% 100%,
      0 -50px,
      100% -50px;
  }
  52.5% {
    background-position:
      0 100%,
      100% 100%,
      0 calc(100% - 16px),
      100% -50px;
  }
  70%,
  98% {
    background-position:
      0 100%,
      100% 100%,
      0 calc(100% - 16px),
      100% calc(100% - 16px);
  }
}
@keyframes l7-2 {
  0%,
  70% {
    transform: translate(0);
  }
  100% {
    transform: translate(200%);
  }
}
</style>
