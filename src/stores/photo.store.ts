import { defineStore } from 'pinia';

export const usePhotoStore = defineStore('photo', {
  state: () => ({
    photos: []
  }),
  actions: {
    addPhoto(photo) {
      this.photos.push(photo);
    },
    deletePhoto(index) {
      this.photos.splice(index, 1);
    },
    updateResponse(photoIndex, key, value) {
      const photo = this.photos[photoIndex];
      if (photo && photo.response) {
        photo.response[key] = value;
      }
    },
    deleteResponseKey(photoIndex, key) {
      const photo = this.photos[photoIndex];
      if (photo && photo.response) {
        delete photo.response[key];
      }
    }
  }
});
