export default {
  namespaced: true,

  state: {},
  actions: {
    loginWithEmailAndPassword(context, formData) {
      console.log(formData);
    },
    registerUser(context, formData) {
      console.log(formData);
    },
  },
};
