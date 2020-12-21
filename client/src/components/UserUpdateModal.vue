<template>
  <div>
    <button @click="isOpen = true" class="button is-primary is-outlined m-t-sm">
      Update Info
    </button>
    <div v-if="isOpen" :class="['modal', { 'is-active': isOpen }]">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">User Profile</p>
          <button
            @click="isOpen = false"
            class="delete"
            aria-label="close"
          ></button>
        </header>
        <section class="modal-card-body">
          <form>
            <div class="field">
              <label class="title">Name</label>
              <input v-model="user.name" class="input" />
            </div>
            <div class="field">
              <label class="title">Username</label>
              <input v-model="user.username" class="input" />
            </div>
            <div class="field">
              <label class="title">Avatar</label>
              <input v-model="user.avatar" class="input" />
            </div>
            <div class="field">
              <label class="title">Info</label>
              <input v-model="user.info" class="input" />
            </div>
          </form>
        </section>
        <footer class="modal-card-foot">
          <button @click="submitForm" class="button is-success">
            Save changes
          </button>
          <button @click="isOpen = false" class="button">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // #note 'user' was got through props, now directly from state opt
    // rm
    // authUser: {
    //   type: Object,
    //   reuqired: true,
    // },
  },

  computed: {
    userFromState() {
      return this.$store.state.auth.user;
    },
    user() {
      return { ...this.userFromState };
    },
  },

  data() {
    return {
      isOpen: false,
    };
  },

  methods: {
    submitForm() {
      // #note 'if statement' to avoid submitting without changes opt
      if (JSON.stringify(this.user) !== JSON.stringify(this.userFromState)) {
        this.$emit('formSubmitted', {
          user: this.user,
          done: () => {
            this.isOpen = false;
          },
        });
      } else {
        this.isOpen = false;
      }
    },
  },
};
</script>
