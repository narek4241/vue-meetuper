<template>
  <div class="container">
    <section>
      <h2 class="status-message">
        User is Getting Activated...
      </h2>
      <app-spinner></app-spinner>
    </section>
  </div>
</template>

<script>
import AppSpinner from '@/components/shared/AppSpinner';
import { USER_ACTIVATED } from '@/helpers/redirectMessages';
export default {
  components: { AppSpinner },

  created() {
    this.activateUser();
  },

  methods: {
    activateUser() {
      const { hash } = this.$route.params;
      this.$store
        .dispatch('auth/activateUser', hash)
        .then(() => {
          this.$router.push({
            path: '/login',
            query: { messageType: USER_ACTIVATED.type },
          });
        })
        .catch((err) => console.error(err));
    },
  },
};
</script>

<style lang="scss">
.status-message {
  text-align: center;
  font-size: 36px;
  font-weight: bold;
}
</style>
