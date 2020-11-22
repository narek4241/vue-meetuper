import Vue from 'vue';
import router from './router';
import store from './store';

import App from './App.vue';
import AppDropdown from './components/shared/AppDropdown';
import AppHero from './components/shared/AppHero';
import AppSpinner from './components/shared/AppSpinner';

import moment from 'moment';

Vue.config.productionTip = false;

// #task #findOut usage (below 1)
Vue.component('AppSpinner', AppSpinner);
Vue.component('AppHero', AppHero);
Vue.component('AppDropdown', AppDropdown);

// needsRes_syntax(afterwards used)
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
  render: (h) => h(App),
}).$mount('#app');
