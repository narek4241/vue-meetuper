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
      <datepicker
        @input="setDate"
        :value="form.startDate"
        :disabled-dates="disabledDates"
        :placeholder="new Date() | formatDate"
        input-class="input"
      ></datepicker>
    </div>
    <div class="field">
      <label class="title m-b-sm">From</label>

      <!-- #note #good '$event' var use in events opt -->
      <vue-timepicker
        @change="changeTime($event, 'timeFrom')"
        :minute-interval="10"
        hide-clear-button
      ></vue-timepicker>
    </div>
    <div class="field">
      <label class="title m-b-sm">To</label>

      <vue-timepicker
        @change="changeTime($event, 'timeTo')"
        :minute-interval="10"
        hide-clear-button
      ></vue-timepicker>
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
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue';

export default {
  components: { Datepicker, VueTimepicker },

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

      disabledDates: {
        customPredictor: (date) => {
          const today = new Date();
          const yesterday = today.setDate(today.getDate() - 1);

          if (date < yesterday) {
            return true;
          }
        },
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

    setDate(date) {
      this.form.startDate = moment(date).format();
      this.emitFormData();
    },

    changeTime({ data }, field) {
      const hours = data.HH || '00';
      const minutes = data.mm || '00';
      this.form[field] = `${hours}:${minutes}`;
      this.emitFormData();
    },
  },
};
</script>

<style scoped>
.time-picker {
  display: block;
}
</style>
