import axios from 'axios';
import axiosInstance from '@/services/axios';

export default {
  namespaced: true,

  state: {
    items: [],
  },

  actions: {
    fetchThreads({ state, commit }, meetupId) {
      return axios.get(`/api/v1/threads?meetupId=${meetupId}`).then((res) => {
        const threads = res.data;
        commit(
          'setItems',
          { resource: 'threads', items: threads },
          { root: true }
        );
        return state.items;
      });
    },

    postThread({ state, commit }, { title, meetupId }) {
      const thread = {
        title,
        meetup: meetupId,
      };

      return axiosInstance.post('/api/v1/threads', thread).then((res) => {
        const newThread = res.data;
        const index = state.items.length;

        commit(
          'addItemToArray',
          {
            item: newThread,
            index,
            resource: 'threads',
          },
          { root: true }
        );
      });
    },
  },

  mutations: {
    setThreads(state, threads) {
      state.items = threads;
    },
  },
};
