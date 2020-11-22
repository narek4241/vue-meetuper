import axios from 'axios';

export default {
  // #task #res explain usage
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
  },
};