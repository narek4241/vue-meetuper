<template>
  <div>
    <AppHero />
    <div v-if="pageLoader_isDataLoaded" class="container">
      <section class="section">
        <div class="m-b-lg">
          <h1 class="title is-inline">
            Featured Meetups <span v-if="ipLocation">in {{ ipLocation }}</span>
          </h1>
          <AppDropdown />
          <router-link
            v-if="isAuthenticated"
            :to="{ name: 'PageMeetupCreate' }"
            class="button is-primary is-pulled-right m-r-sm"
          >
            Create Meetups
          </router-link>

          <router-link
            :to="{ name: 'PageMeetupFind' }"
            class="button is-primary is-pulled-right m-r-sm"
            >All</router-link
          >
        </div>

        <div class="row columns meetups-collection">
          <meetup-item
            v-for="meetup in meetups"
            :key="meetup._id"
            :meetup="meetup"
          ></meetup-item>
          <pagination :page-count="10" :click-handler="() => {}"></pagination>
        </div>
      </section>
      <section class="section">
        <div>
          <h1 class="title">Categories</h1>
          <div class="columns cover is-multiline is-mobile">
            <category-item
              v-for="category in categories"
              :key="category._id"
              :category="category"
            />
          </div>
        </div>
      </section>
    </div>
    <div v-else class="container">
      <app-spinner />
    </div>
  </div>
</template>

<script>
import CategoryItem from '@/components/CategoryItem';
import MeetupItem from '@/components/MeetupItem';
import AppSpinner from '@/components/shared/AppSpinner';
import { mapState, mapActions, mapGetters } from 'vuex';
import pageLoader from '@/mixins/pageLoader';
import Pagination from '@/components/Pagination';
// import { processLocation } from '@/helpers';

export default {
  components: { CategoryItem, MeetupItem, AppSpinner, Pagination },

  mixins: [pageLoader],

  computed: {
    ...mapGetters({
      isAuthenticated: 'auth/isAuthenticated',
      // #note meetups by location,also need to provide filter to fetchMeetups
      // ipLocation: 'meta/location',
    }),
    ...mapState({
      meetups: (state) => state.meetups.items,
      categories: (state) => state.categories.items,
    }),
  },

  created() {
    const filter = {};
    // #note meetups by location
    // if (this.ipLocation) {
    //   filter.location = processLocation(this.ipLocation);
    // }

    Promise.all([this.fetchMeetups({ filter }), this.fetchCategories()])
      .then(() => {
        this.isDataLoaded = true;
        this.pageLoader_resolveData();
      })
      .catch((err) => {
        console.error(err);
        this.pageLoader_resolveData();
      });
  },

  data() {
    return {
      // #note avoids opt
      ipLocation: false,
    };
  },

  methods: {
    // #task #res explain '...' syntax
    ...mapActions('meetups', ['fetchMeetups']),
    ...mapActions('categories', ['fetchCategories']),
  },
};
</script>

<style scoped>
.meetups-collection {
  flex-wrap: wrap;
}
</style>
