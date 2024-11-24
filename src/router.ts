import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

import AuthPage from './pages/AuthPage.vue';
import HomePage from './pages/HomePage.vue';
import LandingPage from './pages/LandingPage.vue';
import PhotoEditorPage from './pages/PhotoEditorPage.vue';
import TablePage from './pages/TablePage.vue';
import { useAuthStore } from './stores/auth.store';

const routes: Array<RouteRecordRaw> = [
  { path: '/landing', component: LandingPage },
  { path: '/auth', component: AuthPage },
  { path: '/scan', component: HomePage },
  {
    path: '/results',
    name: 'PhotoEditorPage',
    component: PhotoEditorPage
  },
  {
    path: '/table',
    name: 'TablePage',
    component: TablePage
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/scan'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// router.beforeEach(async (to, _from, next) => {
//   const authStore = useAuthStore();
//   if (authStore.isAuthenticated === false && !authStore.user) {
//     await authStore.fetchUser();
//   }
//   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
//     next('/auth');
//   } else {
//     next();
//   }
// });

export default router;
