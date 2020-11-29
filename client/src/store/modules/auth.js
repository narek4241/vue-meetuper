import axios from 'axios';

export default {
  namespaced: true,

  state: {
    user: null,
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
      return axios.post('/api/v1/users/login', formData).then((res) => {
        const user = res.data;
        context.commit('setAuthUser', user);
      });
    },
    registerUser(context, formData) {
      return axios.post('/api/v1/users/register', formData);
    },

    getAuthUser(context) {
      return axios
        .get('/api/v1/users/me')
        .then((res) => {
          const user = res.data;
          context.commit('setAuthUser', user);
          return user;
        })
        .catch((err) => {
          context.commit('setAuthUser', null);
          console.error(err); // opt
          return undefined;
        });
    },
  },

  mutations: {
    setAuthUser(state, user) {
      state.user = user;
    },
  },
};
