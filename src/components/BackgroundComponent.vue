<template>
  <div class="background-image">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style scoped>
.background-image {
  background-image: url('/src/assets/back.svg');
  background-size: auto;
  background-position: bottom;
  background-repeat: no-repeat;
  height: calc(100vh - 70px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
</style>
