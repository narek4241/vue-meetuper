import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';

import PageHome from '../pages/PageHome';
import PageMeetupDetail from '../pages/PageMeetupDetail';
import PageMeetupFind from '../pages/PageMeetupFind';
import PageNotFound from '../pages/PageNotFound';
import PageRegister from '../pages/PageRegister';
import PageLogin from '../pages/PageLogin';
import PageProfile from '../pages/PageProfile';
import PageNotAuthenticated from '../pages/PageNotAuthenticated';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'PageHome',
      component: PageHome,
    },
    {
      path: '/profile',
      name: 'PageProfile',
      component: PageProfile,
      meta: { onlyAuthUser: true },
    },
    {
      path: '/meetups/:id',
      name: 'PageMeetupDetail',
      component: PageMeetupDetail,
    },
    {
      path: '/find',
      name: 'PageMeetupFind',
      component: PageMeetupFind,
    },
    {
      path: '/register',
      name: 'PageRegister',
      component: PageRegister,
      meta: { onlyGuestUser: true },
    },
    {
      path: '/login',
      name: 'PageLogin',
      component: PageLogin,
      meta: { onlyGuestUser: true },
    },
    {
      path: '/401',
      name: 'PageNotAuthenticated',
      component: PageNotAuthenticated,
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound,
    },
  ],
  mode: 'history',
});

router.beforeEach((to, from, next) => {
  store.dispatch('auth/getAuthUser').then(() => {
    const isAuthenticated = store.getters['auth/isAuthenticated'];
    if (to.meta.onlyAuthUser) {
      if (isAuthenticated) {
        next();
      } else {
        next({ name: 'PageNotAuthenticated' });
      }
    } else if (to.meta.onlyGuestUser) {
      if (isAuthenticated) {
        next({ name: 'PageHome' });
      } else {
        next();
      }
    } else {
      next();
    }
  });
});

export default router;
