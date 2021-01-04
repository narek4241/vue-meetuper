import Vue from 'vue';
import router from '@/router';
import store from '@/store';
import vuelidate from 'vuelidate';
import filters from '@/filters';

import App from './App.vue';
import AppDropdown from './components/shared/AppDropdown';
import AppHero from './components/shared/AppHero';
import AppSpinner from './components/shared/AppSpinner';
import toasted from 'vue-toasted';
import AppSocket from './plugins/socket';
import Paginate from 'vuejs-paginate';

Vue.config.productionTip = false;

// #task #findOut usage (below 1)
Vue.component('AppSpinner', AppSpinner);
Vue.component('AppHero', AppHero);
Vue.component('AppDropdown', AppDropdown);
Vue.component('paginate', Paginate);

Vue.use(vuelidate);
Vue.use(toasted);

Vue.use(AppSocket, {
  connection: `${process.env.VUE_APP_URI}`,
});

filters();

new Vue({
  router,
  store,
  vuelidate,
  render: (h) => h(App),
}).$mount('#app');
