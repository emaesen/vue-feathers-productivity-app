<template>
  <form @submit.prevent="login" novalidate="true">
    <fieldset>
      <legend>
        Login
      </legend>
      <div v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
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
          type="text"
          pattern="[0-9A-Za-z][0-9A-Za-z ]{3,15}"
          placeholder=""
        />
        <span></span>
        <span class="validation">Acceptable</span>
      </div>
      <div>
        <label for="password">Password</label>
        <input
          id="password"
          name="password"
          required
          v-model="user.password"
          type="password"
          pattern=".{4,15}"
          placeholder=""
        />
        <span></span>
        <span class="validation">Acceptable</span>
      </div>
      <div class="">
        <input
          class="button"
          type="submit"
          value="Login"
        />
      </div>
    </fieldset>
  </form>
</template>

<script>
export default {
  name: 'Login',
  data: function() {
    return {
      errors: [],
      user: {
        username: '',
        password: ''
      }
    };
  },
  computed: {
  },
  methods: {
    login: function(evt) {
      if (this.validForm()) {
        console.log("submitting form");
        //submit form
      }
      evt.preventDefault();
    },
    validForm(){
      // form has html5 validation
      // do some js validation as backup
      let un = this.user.username;
      let pwd = this.user.password;
      let err = this.errors = [];
      if (!un) {
        err.push('Username is required.');
      }
      if (!pwd) {
        err.push('Password is required.');
      }

      return err.length === 0;
    }
  }
};
</script>

<style scoped>
fieldset {
  border: 1px solid #ccc;
  border-radius: 10px;
  display: inline-block;
}
legend {
  margin:1em 0;
  font-size: 1.1rem;
}
label {
  display:flex;
}
input {
  margin-bottom:1em;
}
input:invalid + span:after {
  content: '✖';
  color: #f00;
  padding-left: 5px;
}
input:valid + span:after {
  content: '✓';
  color: #26b72b;
  padding-left: 5px;
}
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
</style>
