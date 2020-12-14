import Vue from 'vue'; // #task check if could use it locally (without import)
import axios from 'axios';
import axiosInstance from '@/services/axios';

export default {
  // #task #res2 explain usage
  namespaced: true,

  state: {
    items: [],
    item: {},
  },

  actions: {
    fetchMeetups({ state, commit }) {
      commit('setItems', { resource: 'meetups', item: [] }, { root: true });
      return axios.get('/api/v1/meetups').then((res) => {
        const meetups = res.data;
        commit(
          'setItems',
          { resource: 'meetups', items: meetups },
          { root: true }
        );
        // #task #findOut2 whether 'context'({state,commit}) is local(meetups.js) or global(index.js) object
        return state.items;
      });
    },

    fetchMeetup({ state, commit }, meetupId) {
      commit('setItem', { resource: 'meetups', item: {} }, { root: true });
      return axios.get(`/api/v1/meetups/${meetupId}`).then((res) => {
        // #task #findOut mutating state directly, works, why does it not get error, ex. below
        // context.state.meetup = res.data;
        const meetup = res.data;
        commit(
          'setItem',
          { resource: 'meetups', item: meetup },
          { root: true }
        );
        return state.item;
      });
    },

    createMeetup({ rootState }, meetupData) {
      meetupData.meetupCreator = rootState.auth.user;
      meetupData.processedLocation = meetupData.location
        .toLowerCase()
        .replace(/[\s,]+/g, '')
        .trim();

      return axiosInstance
        .post('/api/v1/meetups', meetupData)
        .then((res) => res.data);
    },

    joinMeetup({ rootState, state, dispatch, commit }, meetupId) {
      const user = rootState.auth.user;

      return axiosInstance.post(`api/v1/meetups/${meetupId}/join`).then(() => {
        dispatch('auth/addMeetupToAuthUser', meetupId, { root: true });

        const people = [...state.item.joinedPeople, user];
        commit('addUserToMeetup', people);

        return true;
      });
    },
  },
  mutations: {
    addUserToMeetup({ item }, joinedPeople) {
      Vue.set(item, 'joinedPeople', joinedPeople);
    },
  },
};
