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

    updateStats({ commit }, meetupId) {
      commit('deleteMeetup', meetupId);
    },
  },

  mutations: {
    setStats(state, stats) {
      Object.assign(state, stats);
    },

    deleteMeetup(state, meetupId) {
      const index = state.meetups.data.findIndex(
        (meetup) => meetup._id === meetupId
      );
      state.meetups.data.splice(index, 1);
      state.meetups.count--;
    },
  },
};
