import Vue from 'vue';
import Vuex from 'vuex';

import meetups from './modules/meetups';
import categories from './modules/categories';
import threads from './modules/threads';
import auth from './modules/auth';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    meetups,
    categories,
    threads,
    auth,
  },

  mutations: {
    setItems(state, { resource, items }) {
      state[resource].items = items;
    },
    setItem(state, { resource, item }) {
      state[resource].item = item;
    },
    addItemToArray(state, { item, index, resource }) {
      Vue.set(state[resource].items, index, item);
    },
  },
});
