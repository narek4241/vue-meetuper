<template>
  <div class="meetup-create-form">
    <div class="current-step is-pulled-right">
      {{ currentStep }} of {{ allStepsCount }}
    </div>

    <keep-alive>
      <!-- #note shortHand coded below (as dynamically rendered comp) opt -->
      <!-- <MeetupLocation
        v-if="currentStep === 1"
        @formUpdated="mergeFormData"
        ref="currentComponent"
      />
      <MeetupDetail
        v-if="currentStep === 2"
        @formUpdated="mergeFormData"
        ref="currentComponent"
      />
      <MeetupDescription
        v-if="currentStep === 3"
        @formUpdated="mergeFormData"
        ref="currentComponent"
      />
      <MeetupConfirmation v-if="currentStep === 4" :formData="form" /> -->

      <!-- #note dynamically rendered comp opt -->
      <component
        :is="currentComponent"
        @formUpdated="mergeFormData"
        ref="currentComponent"
        :formData="form"
      >
      </component>
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
        :disabled="!canProceed"
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
      formSteps: [
        'MeetupLocation',
        'MeetupDetail',
        'MeetupDescription',
        'MeetupConfirmation',
      ],

      currentStep: 1,

      canProceed: false,

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
    currentComponent() {
      return this.formSteps[this.currentStep - 1];
    },

    allStepsCount() {
      return this.formSteps.length;
    },

    currentProgress() {
      return (100 / this.allStepsCount) * this.currentStep;
    },
  },

  methods: {
    mergeFormData(updatedForm) {
      this.form = { ...this.form, ...updatedForm.data };
      this.canProceed = updatedForm.isValid;
    },

    prevStep() {
      this.currentStep--;
      this.canProceed = true;
    },
    nextStep() {
      this.currentStep++;
      // #note nextTick Defer the callback to be executed after the next DOM update cycle. opt
      // #note2 above's func-ity <=> (also could done by using $emit)(#isTried: true) opt
      this.$nextTick(() => {
        this.canProceed = !this.$refs['currentComponent'].$v.$invalid;
      });
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
