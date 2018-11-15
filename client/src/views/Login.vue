<template>
  <form @submit.prevent="login" novalidate="true">
    <fieldset>
      <legend>
        Login
      </legend>
      <div v-if="errors.length" class="errors">
        <b>Please correct the following error(s):</b>
        <ul>
          <!-- eslint-disable-next-line -->
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </div>
      <div>
        <label for="username">Username</label>
        <input
          id="username"
          name="username"
          required
          autofocus
          v-model="user.username"
          @change="clearError"
          type="text"
          pattern="[0-9A-Za-z][0-9A-Za-z ]{0,16}[0-9A-Za-z]"
          placeholder=""
        />
        <span class="icon"></span>
        <span class="validation">Acceptable</span>
      </div>
      <div>
        <label for="password">Password</label>
        <input
          id="password"
          name="password"
          required
          v-model="user.password"
          @change="clearError"
          type="password"
          pattern=".{4,18}"
          placeholder=""
        />
        <span class="icon"></span>
        <span class="validation">Acceptable</span>
      </div>
      <div class="">
        <button
          v-if="!loading"
          :disabled="!isValid"
        >
          <font-awesome-icon icon="sign-in-alt" /> Login
        </button>
        <input
          v-if="loading"
          class="button loading"
          type="submit"
          value="in progress..."
          disabled
        />
         <span class="register">
           -or- &nbsp;
           <router-link to="/register">
             <font-awesome-icon icon="user-plus" /> Register
           </router-link>
         </span>
      </div>
      <div
        v-if="authError"
        class="auth-error"
        >
        {{ authError }}
      </div>
    </fieldset>
  </form>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Login',
  data: function() {
    return {
      errors: [],
      user: {
        username: '',
        password: ''
      },
      authError: ''
    };
  },
  computed: {
    isValid: function() {
      return this.validUsername() && this.validPassword();
    },
    ...mapState('auth', { loading: 'isAuthenticatePending' })
  },
  methods: {
    ...mapActions('auth', ['authenticate']),
    login: function(evt) {
      if (this.validForm()) {
        //submit form
        console.log("submitting login form");
        this.authenticate({
          strategy: 'local',
          ...this.user
        }).then(resp => {
          console.log('logged in: ', resp);
          this.$router.push('/dashboard');
        }).catch(e => {
          console.error('Authentication error: ', e);
          this.authError = e.message;
        })
      }
      evt.preventDefault();
    },
    clearError(){
      this.authError = '';
    },
    validForm(){
      // form has html5 validation
      // do some js validation as backup
      let err = this.errors = [];
      if (!this.validUsername()) {
        err.push('Username is invalid.');
      }
      if (!this.validPassword()) {
        err.push('Password is invalid.');
      }
      return err.length === 0;
    },
    validUsername: function() {
      var re = /^[0-9A-Za-z][0-9A-Za-z ]{0,16}[0-9A-Za-z]$/;
      return re.test(this.user.username);
    },
    validPassword: function() {
      var re = /^.{4,18}$/;
      return re.test(this.user.password);
    }
  }
};
</script>

<style scoped lang="less">
.validation {
  visibility: hidden;
  margin-left: 5px;
  font-size: .65rem;
  color: #e67d09;
}
input:valid + span + span.validation {
  color: #26b72b;
  visibility: visible;
}
.errors,
.auth-error {
  font-size: .85rem;
  color: #e67d09;
}
.auth-error {
  margin-left: .2em;
}
ul {
  margin: 0 -1em 1em 0;
}
.register {
  margin-left: 1em;
  font-size: .85rem;
  color: #999;
  font-style: italic;
}
</style>
