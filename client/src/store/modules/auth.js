import axios from 'axios';
import jwt_decode from 'jwt-decode';
import axiosInstance from '@/services/axios';
import { rejectError } from '@/helpers';

const checkTokenValidity = (token) => {
  if (token) {
    const decodedToken = jwt_decode(token);
    return decodedToken && decodedToken.exp * 1000 > new Date().getTime;
  }

  return false;
};

export default {
  namespaced: true,

  state: {
    user: null,
    isAuthResolved: false,
  },

  getters: {
    user(state) {
      // #task #findout usage
      // return state.user || null;
      return state.user;
    },
    isAuthenticated(state) {
      return !!state.user;
    },
  },

  actions: {
    loginWithEmailAndPassword(context, formData) {
      return axios
        .post('/api/v1/users/login', formData)
        .then((res) => {
          const user = res.data;
          localStorage.setItem('meetuper-jwt', user.token);
          context.commit('setAuthUser', user);
        })
        .catch((err) => rejectError(err));
    },
    registerUser(context, formData) {
      return axios
        .post('/api/v1/users/register', formData)
        .catch((err) => rejectError(err));
    },

    logout(context) {
      // #note Only for "Session" Authentication
      // return axios
      //   .post('/api/v1/users/logout')
      //   .then(() => {
      //     context.commit('setAuthUser', null);
      //   })
      //   .catch((err) => {
      //     return err;
      //   });

      return new Promise((resolve) => {
        localStorage.removeItem('meetuper-jwt');
        context.commit('setAuthUser', null);
        resolve();
      });
    },

    getAuthUser(context) {
      const user = context.getters.user;
      const token = localStorage.getItem('meetuper-jwt');
      const isTokenValid = checkTokenValidity(token);

      if (user && isTokenValid) {
        // #task #th #res2 syntax case usage
        return Promise.resolve(user);
      }

      const config = {
        headers: {
          'Cache-Conrol': 'no-cache',
        },
      };

      return axiosInstance
        .get('/api/v1/users/me', config)
        .then((res) => {
          const user = res.data;
          context.commit('setAuthUser', user);
          context.commit('setAuthState', true);
          return user;
        })
        .catch((err) => {
          context.commit('setAuthUser', null);
          context.commit('setAuthState', true);
          return err;
        });
    },
  },

  mutations: {
    setAuthUser(state, user) {
      state.user = user;
    },
    setAuthState(state, authState) {
      state.isAuthResolved = authState;
    },
  },
};
