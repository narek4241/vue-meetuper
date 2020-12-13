<template>
  <form @input="emitFormData">
    <div class="field">
      <label class="title m-b-sm">Choose Title</label>
      <input
        @blur="$v.form.title.$touch()"
        v-model="form.title"
        class="input"
        type="text"
        placeholder="Enter Title"
      />
      <div v-if="$v.form.title.$error">
        <span v-if="!$v.form.title.required" class="help is-danger"
          >Title is required</span
        >
      </div>
    </div>
    <div class="field">
      <label class="title m-b-sm">Starts At</label>
      <input
        @blur="$v.form.startDate.$touch()"
        v-model="form.startDate"
        class="input"
        type="text"
        placeholder="Starts At"
      />
      <div v-if="$v.form.startDate.$error">
        <span v-if="!$v.form.startDate.required" class="help is-danger"
          >Starts at is required</span
        >
      </div>
    </div>
    <div class="field">
      <label class="title m-b-sm">From</label>
      <input
        @blur="$v.form.timeFrom.$touch()"
        v-model="form.timeFrom"
        class="input"
        type="text"
        placeholder="Time From"
      />
      <div v-if="$v.form.timeFrom.$error">
        <span v-if="!$v.form.timeFrom.required" class="help is-danger"
          >Time From is required</span
        >
      </div>
    </div>
    <div class="field">
      <label class="title m-b-sm">To</label>
      <input
        @blur="$v.form.timeTo.$touch()"
        v-model="form.timeTo"
        class="input"
        type="text"
        placeholder="Time to"
      />
      <div v-if="$v.form.timeTo.$error">
        <span v-if="!$v.form.timeTo.required" class="help is-danger"
          >Time To is required</span
        >
      </div>
    </div>
    <div class="field">
      <label class="title m-b-sm">Please Choose the Category.</label>
      <div class="m-b-lg">
        <div class="select">
          <select
            @change="emitFormData"
            @blur="$v.form.category.$touch()"
            v-model="form.category"
          >
            <option
              v-for="category of categories"
              :value="category"
              :key="category.id"
              >{{ category.name }}</option
            >
          </select>
        </div>
        <div v-if="$v.form.category.$error">
          <span v-if="!$v.form.category.required" class="help is-danger"
            >Category is required</span
          >
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
export default {
  created() {
    if (this.categories.length === 0) {
      this.$store.dispatch('categories/fetchCategories');
    }
  },

  computed: {
    categories() {
      return this.$store.state.categories.items;
    },
  },

  data() {
    return {
      form: {
        title: null,
        startDate: null,
        timeTo: null,
        timeFrom: null,
        category: null,
      },
    };
  },

  validations: {
    form: {
      title: { required },
      startDate: { required },
      category: { required },
      timeTo: { required },
      timeFrom: { required },
    },
  },

  methods: {
    emitFormData() {
      this.$emit('formUpdated', {
        data: this.form,
        isValid: !this.$v.$invalid,
      });
    },
  },
};
</script>

<style scoped>
.time-picker {
  display: block;
}
</style>
