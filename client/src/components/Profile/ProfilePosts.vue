<template>
  <div>
    <div v-if="posts && posts.length > 0">
      <div
        v-for="post in posts"
        :key="post._id"
        class="columns is-mobile is-multiline"
      >
        <div class="column is-3-tablet is-6-mobile">
          <div class="card">
            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <p class="title is-4">{{ post.text }}</p>
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
    <div v-else class="stats-error">No Posts Created Yet :(</div>
  </div>
</template>

<script>
export default {
  props: {
    posts: {
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
