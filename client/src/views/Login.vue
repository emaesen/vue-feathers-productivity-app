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
          type="text"
          pattern="[0-9A-Za-z][0-9A-Za-z ]{0,16}[0-9A-Za-z]"
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
          pattern=".{4,18}"
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
          :disabled="!isValid"
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
    isValid: function() {
      return this.validUsername() && this.validPassword();
    }
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
.errors {
  font-size: .85rem;
  color: #e67d09;
}
ul {
  margin: 0 -1em 1em 0;
}
</style>
