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
    }
  }
});
