<template>
  <div class="meetup-create-page">
    <AppHero />
    <section class="section">
      <div class="container">
        <MeetupCreateWizard @meetupConfirmed="createMeetup" />
      </div>
    </section>
  </div>
</template>

<script>
import MeetupCreateWizard from '@/components/MeetupCreate/MeetupCreateWizard';
export default {
  components: {
    MeetupCreateWizard,
  },

  methods: {
    createMeetup(formData) {
      this.$store
        .dispatch('meetups/createMeetup', formData)
        .then((createdMeetup) => {
          if (createdMeetup) {
            this.$router.push(`/meetups/${createdMeetup._id}`);
          } else {
            // #note opt
            return;
          }
        });
    },
  },
};
</script>

<style scoped lang="scss">
.meetup-create-page {
  min-height: 100vh;
}
</style>
