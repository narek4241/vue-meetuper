import Vue from 'vue';
import axios from 'axios';
import axiosInstance from '@/services/axios';
import { applyFilters } from '@/helpers';

export default {
  namespaced: true,

  state: {
    isAllThreadsLoaded: false,
    items: [],
  },

  actions: {
    fetchThreads({ state, commit }, { meetupId, filter = {}, init }) {
      if (init) {
        commit('setItems', { resource: 'threads', items: [] }, { root: true });
      }

      const url = applyFilters(`/api/v1/threads?meetupId=${meetupId}`, filter);

      return axios.get(url).then((res) => {
        const { threads, isAllDataLoaded } = res.data;

        commit('mergeThreads', threads);
        commit('setIsAllThreadsLoaded', isAllDataLoaded);

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

    sendPost({ dispatch }, { text, threadId }) {
      const post = {
        text,
        thread: threadId,
      };

      return axiosInstance.post('/api/v1/posts', post).then((res) => {
        const createdPost = res.data;
        dispatch('addPostToThread', { post: createdPost, threadId });

        return createdPost;
      });
    },

    addPostToThread({ state, commit }, { post, threadId }) {
      const threadIndex = state.items.findIndex(
        (thread) => thread._id === threadId
      );

      if (threadIndex > -1) {
        const { posts } = state.items[threadIndex];
        posts.unshift(post);
      }

      commit('savePostToThread', {
        posts: this.posts,
        threadIndex: this.threadIndex,
      });
    },
  },

  mutations: {
    savePostToThread(state, { posts, threadIndex }) {
      Vue.set(state.items, threadIndex, { posts });
    },

    setIsAllThreadsLoaded(state, isAllDataLoaded) {
      state.isAllThreadsLoaded = isAllDataLoaded;
    },

    mergeThreads(state, threads) {
      state.items = [...state.items, ...threads];
    },
  },
};
