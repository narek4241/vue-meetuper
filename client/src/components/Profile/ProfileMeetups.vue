<template>
  <div>
    <div v-if="meetups && meetups.length > 0 && isDataLoaded">
      <div
        v-for="meetup in meetups"
        :key="meetup._id"
        class="columns is-mobile is-multiline"
      >
        <div class="column is-3-tablet is-6-mobile">
          <div class="card">
            <router-link
              :to="{ name: 'PageMeetupDetail', params: { id: meetup._id } }"
            >
              <div class="card-image">
                <figure class="image is-4by3">
                  <img :src="meetup.image" />
                </figure>
              </div>
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="title is-4">{{ meetup.title }}</p>
                    <p class="subtitle is-6">
                      <span class="tag is-dark subtitle">{{
                        meetup.category.name | capitalize
                      }}</span>
                    </p>
                  </div>
                </div>
                <div class="content">
                  <p>
                    {{ meetup.shortInfo }}
                  </p>
                </div>
              </div>
            </router-link>
            <footer class="card-footer">
              <router-link
                :to="{
                  name: 'PageMeetupEdit',
                  params: { meetupId: meetup._id },
                }"
                class="card-footer-item"
                >Edit</router-link
              >
              <a
                @click.prevent="
                  $emit('onDelete', { e: $event, meetupId: meetup._id })
                "
                class="card-footer-item delete-item"
                >Delete</a
              >
            </footer>
          </div>
          <br />
        </div>
      </div>
    </div>
    <div v-else class="stats-error">
      <div v-if="isDataLoaded">
        No Meetups Created Yet :(
      </div>
      <div v-else>
        <app-spinner></app-spinner>
      </div>
    </div>
  </div>
</template>

<script>
import AppSpinner from '@/components/shared/AppSpinner';
export default {
  components: {
    AppSpinner,
  },
  props: {
    meetups: {
      type: Array,
      required: true,
    },
    isDataLoaded: {
      type: Boolean,
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
