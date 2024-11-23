<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const isActive = (path: string) => {
  return route.path === path;
};
</script>

<template>
  <div class="header-container">
    <div class="header-logo">
      <img
        src="/images/logo.svg"
        alt=""
      />
      <img
        src="/src/assets/paperless.svg"
        alt=""
      />
    </div>
    <div class="header-navbar">
      <div class="navbar-list">
        <ul class="list">
          <li class="list-item">
            <a
              :class="{ active: isActive('/landing') }"
              href="/landing"
              >О платформе</a
            >
          </li>
          <li class="list-item">
            <a
              :class="{ active: isActive('/scan') }"
              href="/scan"
              >Сканирование документов</a
            >
          </li>
          <li class="list-item">
            <a
              :class="{ active: isActive('/about') }"
              href="/about"
              >История</a
            >
          </li>
          <li class="list-item">
            <a
              :class="{ active: isActive('/answers') }"
              href="/answers"
              >FAQ</a
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="profile"><div class="profile-button">Профиль</div></div>
  </div>
</template>

<style scoped>
.header {
}

.profile-button {
  background-color: #ff0032;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  border-radius: 4px;
  color: #fff;
  width: 125px;
  height: 46px;
}
.list-item > a {
  background-color: transparent;
}

.list-item > a.active {
  color: #ff0032;
}

.header-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  margin: 0px 12px;
  padding: 0px 238px;
}

@media screen and (max-width: 1500px) {
  .header-container {
    padding: 0;
  }
}

@media screen and (max-width: 800px) {
  .logo-image {
  }

  .list {
  }
}

.header-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.logo-image {
  width: 165px;
}

.list {
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

a {
  color: #454545;
  font-weight: 700;
  font-size: 20px;
  text-decoration: none;
}

ul li {
  margin-right: 20px;
}

ul li:last-child {
  margin-right: 0px;
}
</style>
