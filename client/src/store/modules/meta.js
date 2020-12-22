import axios from 'axios';

export default {
  namespaced: true,

  state: {
    item: {
      city: null,
      country: null,
    },
  },

  getters: {
    location(state) {
      const { city, country } = state.item;
      return city && country ? `${city}, ${country}` : null;
    },
  },

  actions: {
    fetchMetaData({ commit }) {
      return axios.get('/api/v1').then((res) => {
        const meta = res.data;
        commit('setItem', { item: meta, resource: 'meta' }, { root: true });
        return meta;
      });
    },
  },
};
