<template>
  <div class="container">
    <error-view
      title="Ooooops, page you are trying to access doesn't exist'"
      status="404"
      navigateToPage="PageHome"
      navigateToText="Navigate back Home"
    />
  </div>
</template>

<script>
import ErrorView from '../components/ErrorView';
export default {
  components: { ErrorView },
};
</script>

ErrorView
<style scoped>
.title {
  font-size: 40px;
}
.subtitle {
  font-size: 140px;
  text-align: center;
}
.notFoundContainer {
  margin-top: 80px;
}
</style>
