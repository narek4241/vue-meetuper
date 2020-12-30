<template>
  <div>
    <div v-if="threads && threads.length > 0">
      <div
        v-for="thread in threads"
        :key="thread._id"
        class="columns is-mobile is-multiline"
      >
        <div class="column is-3-tablet is-6-mobile">
          <div class="card">
            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <p class="title is-4">{{ thread.title }}</p>
                </div>
              </div>
            </div>
            <!-- #note commented yet, implement later -->
            <!-- <footer class="card-footer">
              <a class="card-footer-item">Edit</a>
              <a class="card-footer-item delete-item">Delete</a>
            </footer> -->
          </div>
          <br />
        </div>
      </div>
    </div>
    <div v-else class="stats-error">No Threads Created Yet :(</div>
  </div>
</template>

<script>
export default {
  props: {
    threads: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.delete-item {
  color: red;
}

.stats-error {
  font-size: 40px;
  font-weight: bold;
  margin-top: 30px;
  margin-left: 15px;
}
</style>
