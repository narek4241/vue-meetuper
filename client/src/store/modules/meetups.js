import Vue from 'vue'; // #task check if could use it locally (without import)
import axios from 'axios';
import axiosInstance from '@/services/axios';
import { applyFilters } from '@/helpers';

export default {
  // #task #res2 explain usage
  namespaced: true,

  state: {
    items: [],
    item: {},
    pagination: {
      count: 0,
      pageCount: 0,
      pageSize: 6,
      pageNumber: 1,
    },
  },

  actions: {
    fetchMeetups({ state, commit }, options = { reset: true }) {
      if (options.reset) {
        commit('setItems', { resource: 'meetups', item: [] }, { root: true });
      }

      const url = applyFilters('/api/v1/meetups', options.filter);

      return axios.get(url).then((res) => {
        const { meetups, count, pageCount } = res.data;
        commit(
          'setItems',
          { resource: 'meetups', items: meetups },
          { root: true }
        );
        commit('setPagination', { count, pageCount });
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

    updateMeetup({ commit }, meetupData) {
      meetupData.processedLocation = meetupData.location
        .toLowerCase()
        .replace(/[\s,]+/g, '')
        .trim();

      return axiosInstance
        .patch(`/api/v1/meetups/${meetupData._id}`, meetupData)
        .then((res) => {
          const updatedMeetup = res.data;
          commit('mergeMeetup', updatedMeetup);
        });
    },

    deleteMeetup(context, meetupId) {
      return axiosInstance.delete(`/api/v1/meetups/${meetupId}`).then((res) => {
        const deletedMeetupId = res.data;
        return deletedMeetupId;
      });
    },

    joinMeetup({ rootState, state, dispatch, commit }, meetupId) {
      const user = rootState.auth.user;

      return axiosInstance.post(`/api/v1/meetups/${meetupId}/join`).then(() => {
        dispatch('auth/addMeetupToAuthUser', meetupId, { root: true });

        const people = [...state.item.joinedPeople, user];
        commit('addUsersToMeetup', people);

        return true;
      });
    },

    leaveMeetup({ rootState, state, dispatch, commit }, meetupId) {
      const user = rootState.auth.user;

      return axiosInstance
        .post(`/api/v1/meetups/${meetupId}/leave`)
        .then(() => {
          dispatch('auth/removeMeetupFromAuthUser', meetupId, { root: true });

          const people = state.item.joinedPeople;
          const index = people.findIndex(
            (joinedUser) => joinedUser._id === user._id
          );
          people.splice(index, 1);
          commit('addUsersToMeetup', people);

          return true;
        });
    },

    initalizePagesFromQuery({ commit }, { pageSize, pageNumber }) {
      commit('setPage', pageNumber);
      commit('setPageSize', pageSize);
    },
  },
  mutations: {
    addUsersToMeetup({ item }, joinedPeople) {
      Vue.set(item, 'joinedPeople', joinedPeople);
    },

    mergeMeetup(state, updatedMeetup) {
      state.item = { ...state.item, ...updatedMeetup };
    },

    setPagination({ pagination }, { count, pageCount }) {
      Vue.set(pagination, 'count', count);
      Vue.set(pagination, 'pageCount', pageCount);
    },

    setPage({ pagination }, page) {
      Vue.set(pagination, 'pageNumber', page);
    },

    setPageSize({ pagination }, pageSize) {
      Vue.set(pagination, 'pageSize', pageSize);
    },
  },
};
