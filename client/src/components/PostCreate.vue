<template>
  <form class="post-create">
    <div class="field">
      <textarea
        v-auto-expand
        v-model="text"
        class="textarea textarea-post"
        placeholder="Write a post"
        rows="1"
      ></textarea>
      <button
        @click.prevent="sendPost"
        :disabled="!text"
        class="button is-primary m-t-sm"
      >
        Send
      </button>
    </div>
  </form>
</template>

<script>
import autoExpand from '@/directives/autoExpand';
export default {
  directives: {
    autoExpand,
  },

  props: {
    threadId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      text: null,
    };
  },

  methods: {
    sendPost() {
      this.$store
        .dispatch('threads/sendPost', {
          text: this.text,
          threadId: this.threadId,
        })
        .then((createdPost) => {
          this.$root.socket.emit('meetup/sendPost', createdPost);
          this.text = null;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.post-create {
  margin-bottom: 15px;
}
.textarea-post {
  padding-bottom: 30px;
  overflow: hidden;
}
</style>
