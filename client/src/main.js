import Vue from 'vue';
import router from './router';
import store from './store';
import vuelidate from 'vuelidate';

import App from './App.vue';
import AppDropdown from './components/shared/AppDropdown';
import AppHero from './components/shared/AppHero';
import AppSpinner from './components/shared/AppSpinner';
import toasted from 'vue-toasted';
import AppSocket from './plugins/socket';

// #task #res usage opt
import moment from 'moment';

Vue.config.productionTip = false;

// #task #findOut usage (below 1)
Vue.component('AppSpinner', AppSpinner);
Vue.component('AppHero', AppHero);
Vue.component('AppDropdown', AppDropdown);

Vue.use(vuelidate);
Vue.use(toasted);

// #task import from configs -> check worklow IMPORTANT
// #note smth like this (connection: process.env.BASE_URL || 'http://localhost:3001',)
Vue.use(AppSocket, {
  connection: 'http://localhost:3001',
});

Vue.filter('capitalize', function(value) {
  if (value && typeof value === 'string') {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return '';
});

Vue.filter('formatDate', function(value, formatType = 'LL') {
  if (!value) return;
  return moment(value).format(formatType);
});

Vue.filter('fromNow', (value) => {
  if (!value) return;
  return moment(value).fromNow();
});

new Vue({
  router,
  store,
  vuelidate,
  render: (h) => h(App),
}).$mount('#app');
