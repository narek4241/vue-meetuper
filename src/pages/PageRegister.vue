<template>
  <section class="hero is-success is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <h3 class="title has-text-grey">Register</h3>
          <p class="subtitle has-text-grey">Please register to proceed.</p>
          <div class="box">
            <figure class="avatar">
              <img src="https://placehold.it/128x128" />
            </figure>
            <form>
              <div class="field">
                <div class="control">
                  <input
                    v-model="form.username"
                    @blur="$v.form.username.$touch()"
                    class="input is-large"
                    type="text"
                    placeholder="Username"
                  />
                  <div v-if="$v.form.username.$error" class="form-error">
                    <span
                      v-if="!$v.form.username.required"
                      class="help is-danger"
                      >Username Required
                    </span>
                    <span
                      v-if="!$v.form.username.minLength"
                      class="help is-danger"
                      >Username must be min 6
                    </span>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input
                    v-model="form.name"
                    @blur="$v.form.name.$touch()"
                    class="input is-large"
                    type="text"
                    placeholder="Name"
                  />
                  <div v-if="$v.form.name.$error" class="form-error">
                    <span v-if="!$v.form.name.required" class="help is-danger"
                      >Name Required
                    </span>
                    <span v-if="!$v.form.name.minLength" class="help is-danger"
                      >Name must be min 2
                    </span>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input
                    v-model="form.email"
                    @blur="$v.form.email.$touch()"
                    class="input is-large"
                    type="email"
                    placeholder="Your Email"
                  />
                  <div v-if="$v.form.email.$error" class="form-error">
                    <span v-if="!$v.form.email.required" class="help is-danger"
                      >Email Required
                    </span>
                    <span v-if="!$v.form.email.email" class="help is-danger"
                      >Email must be valid
                    </span>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input
                    v-model="form.avatar"
                    @blur="$v.form.avatar.$touch()"
                    class="input is-large"
                    type="text"
                    placeholder="Avatar"
                    autocomplete="true"
                  />
                  <div v-if="$v.form.avatar.$error" class="form-error">
                    <span v-if="!$v.form.avatar.url" class="help is-danger"
                      >URL must be valid
                    </span>
                    <span
                      v-if="!$v.form.avatar.supportedFileTypes"
                      class="help is-danger"
                      >URL: Image type not supported
                    </span>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input
                    v-model="form.password"
                    @blur="$v.form.password.$touch()"
                    class="input is-large"
                    type="password"
                    placeholder="Your Password"
                    autocomplete="new-password"
                  />
                  <div v-if="$v.form.password.$error" class="form-error">
                    <span
                      v-if="!$v.form.password.required"
                      class="help is-danger"
                      >Password Required
                    </span>
                    <span
                      v-if="!$v.form.password.minLength"
                      class="help is-danger"
                      >Password must be min 8
                    </span>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input
                    v-model="form.repeatPassword"
                    @blur="$v.form.repeatPassword.$touch()"
                    class="input is-large"
                    type="password"
                    placeholder="Password Confirmation"
                    autocomplete="off"
                  />
                  <div v-if="$v.form.repeatPassword.$error" class="form-error">
                    <span
                      v-if="!$v.form.repeatPassword.required"
                      class="help is-danger"
                      >Confirm Password Required
                    </span>
                    <span
                      v-if="!$v.form.repeatPassword.sameAsPassword"
                      class="help is-danger"
                      >Confirm Password must match
                    </span>
                  </div>
                </div>
              </div>
              <button
                @click.prevent="register"
                :disabled="!isFormValid"
                type="submit"
                class="button is-block is-info is-large is-fullwidth"
              >
                Register
              </button>
            </form>
          </div>
          <p class="has-text-grey">
            <router-link :to="{ name: 'PageLogin' }">Login</router-link>
            &nbsp;·&nbsp; <a>Sign Up With Google</a> &nbsp;·&nbsp;
            <a href="../">Need Help?</a>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { supportedFileTypes } from '../helpers/validators';
import {
  required,
  email,
  minLength,
  url,
  sameAs,
} from 'vuelidate/lib/validators';
export default {
  data() {
    return {
      form: {
        // #task #findOut whether use '' or null*
        username: '',
        name: '',
        email: '',
        avatar: '',
        password: '',
        confPassword: '',
      },
    };
  },

  computed: {
    isFormValid() {
      return !this.$v.form.$invalid;
    },
  },

  validations: {
    form: {
      username: {
        required,
        minLength: minLength(6),
      },
      name: {
        required,
        minLength: minLength(2),
      },
      email: {
        required,
        email,
      },
      avatar: {
        url,
        supportedFileTypes,
      },
      password: {
        required,
        minLength: minLength(8),
      },
      repeatPassword: {
        required,
        sameAsPassword: sameAs('password'),
      },
    },
  },

  methods: {
    register() {
      this.$store.dispatch('auth/registerUser', this.form);
    },
  },
};
</script>

<style scoped>
.hero.is-success {
  background: #f2f6fa;
}
.hero .nav,
.hero.is-success .nav {
  -webkit-box-shadow: none;
  box-shadow: none;
}
.box {
  margin-top: 5rem;
}
.avatar {
  margin-top: -70px;
  padding-bottom: 20px;
}
.avatar img {
  padding: 5px;
  background: #fff;
  border-radius: 50%;
  -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1),
    0 0 0 1px rgba(10, 10, 10, 0.1);
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
}
input {
  font-weight: 300;
}
p {
  font-weight: 700;
}
p.subtitle {
  padding-top: 1rem;
}
</style>
