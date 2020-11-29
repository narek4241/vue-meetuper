import axios from 'axios';

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
      return axios.post('/api/v1/users/login', formData).then((res) => {
        const user = res.data;
        context.commit('setAuthUser', user);
      });
    },
    registerUser(context, formData) {
      return axios.post('/api/v1/users/register', formData);
    },

    logout(context) {
      return axios
        .post('/api/v1/users/logout')
        .then(() => {
          context.commit('setAuthUser', null);
        })
        .catch((err) => {
          return err;
        });
    },

    getAuthUser(context) {
      const user = context.getters.user;
      if (user) {
        // #task #th #res syntax usage
        return Promise.resolve(user);
      }

      return axios
        .get('/api/v1/users/me')
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
