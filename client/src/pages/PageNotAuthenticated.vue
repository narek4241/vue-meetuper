<template>
  <div class="container">
    <error-view
      title="Ooooops, you cannot visit this page, please Login first'"
      status="401"
      navigateToPage="PageLogin"
      navigateToText="Navigate to Login"
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
