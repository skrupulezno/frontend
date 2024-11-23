<script setup lang="ts">
import AnimatedLabel from '../components/AnimatedLabelComponent.vue';
import BackgroundComponent from '../components/BackgroundComponent.vue';
import Header from '../components/HeaderComponent.vue';
</script>

<template>
  <Header />
  <BackgroundComponent>
    <main>
      <div class="label-wrapper">
        <AnimatedLabel />
      </div></main
  ></BackgroundComponent>
</template>

<style scoped lang="scss">
.header-wrapper {
  display: flex;
  justify-content: center;
}

main {
  display: flex;
  justify-content: center;
}

.label-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 1200px;
  margin-bottom: 140px;
}
</style>
