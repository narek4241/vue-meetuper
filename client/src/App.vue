<template>
  <div v-if="isAuthResolved" id="app">
    <TheNavbar />
    <div class="page-wrapper">
      <!-- #note key is for detecting route changes (in order to render) opt -->
      <router-view :key="$route.path" class="page-content" />
    </div>
    <TheFooter />
  </div>
</template>

<script>
import TheNavbar from '@/components/shared/TheNavbar';
import TheFooter from '@/components/shared/TheFooter';
export default {
  name: 'app',
  components: {
    TheNavbar,
    TheFooter,
  },

  computed: {
    isAuthResolved() {
      return this.$store.state.auth.isAuthResolved;
    },
  },

  created() {
    this.$store.dispatch('meta/fetchMetaData');
  },
};
</script>

<style lang="scss">
@import 'assets/css/spacing.css';
@import '~bulma/bulma.sass';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.page-wrapper {
  min-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .page-content {
    width: 100%;
  }
}

.bold {
  font-weight: bold;
}
.cover {
  background-size: cover;
  /*background-position: center;*/
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.hero {
  width: 100%;
  position: relative;
}
.hero-body {
  padding: 3rem 1.5rem;
  width: 100%;
}
.hero-bg {
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url('https://images.unsplash.com/photo-1531263060782-b024de9b9793?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
</style>
