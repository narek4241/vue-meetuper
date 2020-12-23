import axios from 'axios';

export default {
  namespaced: true,

  state: {
    isLocationResolved: false,
    item: {
      city: null,
      country: null,
    },
  },

  getters: {
    isLocationResolved(state) {
      return state.isLocationResolved;
    },
    location(state) {
      const { city, country } = state.item;
      return city && country ? `${city}, ${country}` : null;
    },
  },

  actions: {
    fetchMetaData({ commit }) {
      return axios
        .get('/api/v1')
        .then((res) => {
          const meta = res.data;
          commit('setItem', { item: meta, resource: 'meta' }, { root: true });
          commit('resolveLocation', true);
          return meta;
        })
        .catch((err) => {
          commit('resolveLocation', true);
          return err;
        });
    },
  },

  mutations: {
    resolveLocation(state, isLocationResolved) {
      state.isLocationResolved = isLocationResolved;
    },
  },
};
