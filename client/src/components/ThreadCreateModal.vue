<template>
  <div>
    <button @click="isOpen = !isOpen" class="button is-success">
      {{ btnTitle }}
    </button>
    <!-- #note #good style classes conditional rendering opt -->
    <div :class="['modal', { 'is-active': isOpen }]">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ title }}</p>
          <button
            @click="isOpen = false"
            class="delete"
            aria-label="close"
          ></button>
        </header>
        <section class="modal-card-body">
          <form>
            <div class="field">
              <label class="title">What would you like to ask?</label>
              <textarea
                v-model="form.title"
                class="textarea"
                placeholder="Just write something that interest you (:"
                rows="10"
              ></textarea>
            </div>
          </form>
        </section>
        <footer class="modal-card-foot">
          <button @click="submitThread" class="button is-success">
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
    btnTitle: {
      type: String,
      required: false,
      default: 'Open Modal',
    },
    title: {
      type: String,
      required: false,
      default: 'Create',
    },
  },

  data() {
    return {
      isOpen: false,

      form: {
        title: null,
      },
    };
  },

  methods: {
    submitThread() {
      const { title } = this.form;
      this.$emit('threadSubmitted', {
        title,
        done: () => {
          this.isOpen = false;
          this.form.title = null;
        },
      });
    },
  },
};
</script>

<style scoped></style>
