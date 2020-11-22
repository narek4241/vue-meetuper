import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    meetups: [],
    categories: [],
    threads: [],
    meetup: {},
  },
  getters: {},
  actions: {
    // #task MINI destructurize context to {..} aim?change
    fetchMeetups(context) {
      context.commit('setItems', { resource: 'meetups', item: [] });
      axios.get('/api/v1/meetups').then((res) => {
        const meetups = res.data;
        context.commit('setItems', { resource: 'meetups', items: meetups });
        return context.state.meetups;
      });
    },

    fetchCategories(context) {
      axios.get('/api/v1/categories').then((res) => {
        const categories = res.data;
        context.commit('setItems', {
          resource: 'categories',
          items: categories,
        });
        return context.state.categories;
      });
    },

    fetchMeetup(context, meetupId) {
      context.commit('setItem', { resource: 'meetup', item: {} });
      axios.get(`/api/v1/meetups/${meetupId}`).then((res) => {
        // #task #findOut mutating state directly, works, why does it not get error, ex. below
        // context.state.meetup = res.data;
        const meetup = res.data;
        context.commit('setItem', { resource: 'meetup', item: meetup });
        return context.state.meetup;
      });
    },

    fetchThreads(context, meetupId) {
      axios.get(`/api/v1/threads?meetupId=${meetupId}`).then((res) => {
        const threads = res.data;
        context.commit('setItems', { resource: 'threads', items: threads });
        return context.state.threads;
      });
    },
  },
  mutations: {
    setItems(state, { resource, items }) {
      state[resource] = items;
    },
    setItem(state, { resource, item }) {
      state[resource] = item;
    },
  },
});
