import axiosInstance from '@/services/axios';

export default {
  namespaced: true,

  state: {
    meetups: {
      data: [],
      count: null,
    },

    threads: {
      data: [],
      count: null,
    },

    posts: {
      data: [],
      count: null,
    },
  },

  actions: {
    fetchUserStats({ commit }) {
      return axiosInstance.get('/api/v1/users/me/activity').then((res) => {
        const { meetups, threads, posts } = res.data;
        commit('setStats', { meetups, threads, posts });
        return res.data;
      });
    },
  },

  mutations: {
    setStats(state, stats) {
      Object.assign(state, stats);
    },
  },
};
