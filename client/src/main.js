import Vue from 'vue';
import router from './router';
import store from './store';
import vuelidate from 'vuelidate';

import App from './App.vue';
import AppDropdown from './components/shared/AppDropdown';
import AppHero from './components/shared/AppHero';
import AppSpinner from './components/shared/AppSpinner';

// #task #res usage opt
import moment from 'moment';

Vue.config.productionTip = false;

// #task #findOut usage (below 1)
Vue.component('AppSpinner', AppSpinner);
Vue.component('AppHero', AppHero);
Vue.component('AppDropdown', AppDropdown);

// #task #findOut usage
Vue.use(vuelidate);

// #task #findOut2.5 usage
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

new Vue({
  router,
  store,
  vuelidate,
  render: (h) => h(App),
}).$mount('#app');
