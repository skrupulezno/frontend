<script setup lang="ts">
import BackgroundComponent from '../components/BackgroundComponent.vue';
import DropFilesComponent from '../components/DropFilesComponent.vue';
import HeaderComponent from '../components/HeaderComponent.vue';
</script>

<template>
  <HeaderComponent />
  <BackgroundComponent
    ><DropFilesComponent></DropFilesComponent
  ></BackgroundComponent>
</template>

<style scoped>
.home-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  font-family: 'Roboto', sans-serif;
}

button {
  padding: 10px 20px;
  background-color: #e53935;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
}

button:hover {
  background-color: #d32f2f;
}
</style>
