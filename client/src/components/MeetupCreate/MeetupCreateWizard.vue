<template>
  <div class="meetup-create-form">
    <div class="current-step is-pulled-right">
      {{ currentStep }} of {{ allStepsCount }}
    </div>

    <keep-alive>
      <MeetupLocation v-if="currentStep === 1" @formUpdated="mergeFormData" />
      <MeetupDetail v-if="currentStep === 2" @formUpdated="mergeFormData" />
      <MeetupDescription
        v-if="currentStep === 3"
        @formUpdated="mergeFormData"
      />
      <MeetupConfirmation v-if="currentStep === 4" :formData="form" />
    </keep-alive>

    <progress class="progress" :value="currentProgress" max="100"
      >{{ currentProgress }}%</progress
    >

    <div class="controll-btns m-b-md">
      <button
        @click="prevStep"
        v-if="this.currentStep !== 1"
        class="button is-primary m-r-sm"
      >
        Back
      </button>
      <button
        @click="nextStep"
        v-if="this.currentStep !== this.allStepsCount"
        class="button is-primary"
      >
        Next
      </button>
      <button v-else class="button is-primary">Confirm</button>
    </div>
    <pre><code>{{form}}</code></pre>
  </div>
</template>

<script>
import MeetupLocation from './MeetupLocation';
import MeetupDetail from './MeetupDetail';
import MeetupDescription from './MeetupDescription';
import MeetupConfirmation from './MeetupConfirmation';
export default {
  components: {
    MeetupLocation,
    MeetupDetail,
    MeetupDescription,
    MeetupConfirmation,
  },

  data() {
    return {
      currentStep: 1,
      allStepsCount: 4,

      form: {
        location: null,
        title: null,
        startDate: null,
        category: null,
        image: null,
        shortInfo: null,
        description: null,
        timeTo: null,
        timeFrom: null,
      },
    };
  },

  computed: {
    currentProgress() {
      return (100 / this.allStepsCount) * this.currentStep;
    },
  },

  methods: {
    mergeFormData(updatedFormData) {
      this.form = { ...this.form, ...updatedFormData };
    },

    mergeFormData2(updatedFormData) {
      console.log('detail to wizard logged', updatedFormData, this.form);
    },

    prevStep() {
      this.currentStep--;
    },
    nextStep() {
      this.currentStep++;
    },
  },
};
</script>

<style scoped>
.meetup-create-form {
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  max-width: 840px;
  padding: 24px 16px 8px;
  width: 100%;
}
</style>
