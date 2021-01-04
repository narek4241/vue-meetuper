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
          <template v-if="isPaginatedMeetupsLoaded">
            <meetup-item
              v-for="meetup in meetups"
              :key="meetup._id"
              :meetup="meetup"
            ></meetup-item>
          </template>
          <template v-else>
            <app-spinner />
          </template>
          <!-- #task #res3 template usage here -->
          <template v-if="pagination.pageCount != 1">
            <pagination
              :page="pagination.pageNumber"
              :page-count="pagination.pageCount"
              :click-handler="fetchPaginatedMeetups"
            ></pagination>
          </template>
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
      pagination: (state) => state.meetups.pagination,
    }),
  },

  created() {
    const { pageSize, pageNumber } = this.$route.query;

    // #note persisting 'meetup pagination page' by queries opt
    if (pageSize && pageNumber) {
      this.initalizePagesFromQuery({ pageSize, pageNumber });
    }

    // #note meetups by location
    // const filter = {};
    // if (this.ipLocation) {
    //   filter.location = processLocation(this.ipLocation);
    // }

    Promise.all([this.handleFetchMeetups({}), this.fetchCategories()])
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
      isPaginatedMeetupsLoaded: true,
    };
  },

  methods: {
    // #task #res explain '...' syntax
    ...mapActions('meetups', ['fetchMeetups', 'initalizePagesFromQuery']),
    ...mapActions('categories', ['fetchCategories']),

    handleFetchMeetups({ reset }) {
      const filters = {};
      filters.pageSize = this.pagination.pageSize;
      filters.pageNumber = this.pagination.pageNumber;
      return this.fetchMeetups({ filter: filters, reset }).then(() =>
        this.setPaginationQueryParams()
      );
    },

    setPage(pageNumber) {
      this.$store.commit('meetups/setPage', pageNumber);
    },

    fetchPaginatedMeetups(customPageNumber) {
      (this.isPaginatedMeetupsLoaded = false),
        Promise.all([
          this.setPage(customPageNumber),
          // #note 'finally', doesn't matter resolved or rejected opt
          this.handleFetchMeetups({ reset: false }).finally(() => {
            this.isPaginatedMeetupsLoaded = true;
          }),
        ]);
    },

    setPaginationQueryParams() {
      const { pageSize, pageNumber } = this.pagination;
      // #note checking route changed or not.(otherwise gives an error) opt
      if (
        JSON.stringify({ pageSize, pageNumber }) !=
        JSON.stringify(this.$route.query)
      ) {
        this.$router.push({ query: { pageSize, pageNumber } });
      }
    },
  },
};
</script>

<style scoped>
.meetups-collection {
  flex-wrap: wrap;
}
</style>
