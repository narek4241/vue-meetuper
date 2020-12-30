<template>
  <div class="columns">
    <div class="container profile">
      <div class="section profile-heading">
        <div class="columns is-mobile is-multiline">
          <div class="column is-2">
            <figure class="image  header-icon user-profile-image">
              <img class="is-rounded" :src="user.avatar" />
            </figure>
          </div>
          <div class="column is-4-tablet is-10-mobile name">
            <p>
              <span class="title is-bold">{{ user.name }}</span>
              <br />
              <user-update-modal
                @formSubmitted="updateUser"
              ></user-update-modal>
              <br />
            </p>
            <p class="tagline">
              {{ user.info }}
            </p>
          </div>
          <div
            @click="activeTab = 'meetups'"
            :class="[
              'stats-tab column is-2-tablet is-4-mobile has-text-centered',
              { isActive: activeTab === 'meetups' },
            ]"
          >
            <p class="stat-val">{{ meetupsCount }}</p>
            <p class="stat-key">Meetups</p>
          </div>
          <div
            @click="activeTab = 'threads'"
            :class="[
              'stats-tab column is-2-tablet is-4-mobile has-text-centered',
              { isActive: activeTab === 'threads' },
            ]"
          >
            <p class="stat-val">{{ threadsCount }}</p>
            <p class="stat-key">Threads</p>
          </div>
          <div
            @click="activeTab = 'posts'"
            :class="[
              'stats-tab column is-2-tablet is-4-mobile has-text-centered',
              { isActive: activeTab === 'posts' },
            ]"
          >
            <p class="stat-val">{{ postsCount }}</p>
            <p class="stat-key">Posts</p>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'meetups'">
        <profile-meetups
          @onDelete="deleteMeetup"
          :isDataLoaded="pageLoader_isDataLoaded"
          :meetups="meetups"
        ></profile-meetups>
      </div>

      <div v-if="activeTab === 'threads'">
        <profile-threads :threads="threads"></profile-threads>
      </div>

      <div v-if="activeTab === 'posts'">
        <profile-posts :posts="posts"></profile-posts>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import UserUpdateModal from '@/components/UserUpdateModal';
import ProfileMeetups from '@/components/Profile/ProfileMeetups';
import ProfileThreads from '@/components/Profile/ProfileThreads';
import ProfilePosts from '@/components/Profile/ProfilePosts';
import pageLoader from '@/mixins/pageLoader';

export default {
  components: { UserUpdateModal, ProfileMeetups, ProfileThreads, ProfilePosts },

  mixins: [pageLoader],

  created() {
    this.$store
      .dispatch('stats/fetchUserStats')
      .then(() => {
        this.pageLoader_resolveData();
      })
      .catch(() => {
        this.pageLoader_resolveData();
      });
  },

  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      meetups: ({ stats }) => stats.meetups.data,
      meetupsCount: ({ stats }) => stats.meetups.count,
      threads: ({ stats }) => stats.threads.data,
      threadsCount: ({ stats }) => stats.threads.count,
      posts: ({ stats }) => stats.posts.data,
      postsCount: ({ stats }) => stats.posts.count,
    }),
  },

  data() {
    return {
      activeTab: 'meetups',
    };
  },

  methods: {
    updateUser({ user, done }) {
      this.$store
        .dispatch('auth/updateUser', user)
        .then(() => {
          done();
          this.$toasted.success('Profile Successfully Updated', {
            position: 'top-center',
            duration: 3000,
          });
        })
        .catch((err) => {
          console.error(err);
          done();
        });
    },

    deleteMeetup({ e, meetupId }) {
      // #task #res usage
      e.stopPropagation();

      const isConfirmed = confirm(
        'Are you sure you want to delete this meetup ?'
      );

      if (isConfirmed) {
        this.$store
          .dispatch('meetups/deleteMeetup', meetupId)
          .then((deletedMeetupId) => {
            this.$store.dispatch('stats/updateStats', deletedMeetupId);

            this.$toasted.success('Meetup Successfully Deleted', {
              position: 'top-center',
              duration: 3000,
            });
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        return;
      }
    },
  },
};
</script>

<style scoped>
body {
  background: #f5f7fa;
}

.stats-tab {
  border-bottom: 2px solid transparent;
  transition: 0.5s;
}

.stats-tab:hover {
  cursor: pointer;
  border-bottom: 2px solid black;
}

.stats-tab.isActive {
  border-bottom: 2px solid black;
}

.stat-val {
  font-size: 3em;
  padding-top: 20px;
  font-weight: bold;
}

.stat-key {
  font-size: 1.4em;
  font-weight: 200;
}

.section.profile-heading
  .column.is-2-tablet.has-text-centered
  + .has-text-centered {
  border-left: 1px dotted rgba(0, 0, 0, 0.2);
}

.container.profile {
  margin-top: 1%;
}

.control.is-pulled-left span.select {
  margin-right: 5px;
  border-radius: 2px;
}

.modal-card .content h1 {
  padding: 40px 10px 10px;
  border-bottom: 1px solid #dadada;
}

.container.profile .profile-options .tabs ul li.link a {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f1f1f1;
}
</style>
