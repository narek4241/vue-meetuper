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
export default {
  components: { AppSpinner },

  created() {
    this.activateUser();
  },

  methods: {
    activateUser() {
      const { hash } = this.$route.params;
      this.$store.dispatch('auth/activateUser', hash);
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
