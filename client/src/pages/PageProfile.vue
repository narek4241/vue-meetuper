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
                  @click.prevent="deleteMeetup($event, meetup._id)"
                  class="card-footer-item delete-item"
                  >Delete</a
                >
              </footer>
            </div>
            <br />
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'threads'">
        <div
          v-for="thread in threads"
          :key="thread._id"
          class="columns is-mobile is-multiline"
        >
          <div class="column is-3-tablet is-6-mobile">
            <div class="card">
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="title is-4">{{ thread.title }}</p>
                  </div>
                </div>
              </div>
              <footer class="card-footer">
                <a class="card-footer-item">Share</a>
                <a class="card-footer-item">Delete</a>
              </footer>
            </div>
            <br />
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'posts'">
        <div
          v-for="post in posts"
          :key="post._id"
          class="columns is-mobile is-multiline"
        >
          <div class="column is-3-tablet is-6-mobile">
            <div class="card">
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="title is-4">{{ post.text }}</p>
                  </div>
                </div>
              </div>
              <footer class="card-footer">
                <a class="card-footer-item">Share</a>
                <a class="card-footer-item">Delete</a>
              </footer>
            </div>
            <br />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import UserUpdateModal from '@/components/UserUpdateModal';

export default {
  components: { UserUpdateModal },

  created() {
    this.$store.dispatch('stats/fetchUserStats');
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

    deleteMeetup(e, meetupId) {
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

.delete-item {
  color: red;
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
