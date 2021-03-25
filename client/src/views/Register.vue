<template>
  <form id="register-form" @submit.prevent="register">
    <fieldset>
      <legend>Register</legend>
      <div v-if="errors.length" class="errors">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
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
          placeholder
        >
        <span class="icon"></span>
        <span class="warning">2 to 18 letters, numbers or spaces</span>
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
          placeholder
        >
        <span class="icon"></span>
        <span class="warning">4 to 18 characters</span>
      </div>
      <div>
        <label for="confirm-password">Confirm Password</label>
        <input
          id="confirm-password"
          name="confirm-password"
          required
          v-model="confirmPassword"
          type="password"
          :pattern="user.password"
          placeholder
        >
        <span class="icon"></span>
        <span class="warning">Match password</span>
      </div>
      <div class>
        <button v-if="!loading" :disabled="!isValid" class="action button">
          <font-awesome-icon icon="user-plus"/>Register
        </button>
        <input v-if="loading" class="button loading" type="submit" value="in progress..." disabled>
        <span class="login">-or- &nbsp;
          <router-link to="/login">
            <font-awesome-icon icon="sign-in-alt"/>Login
          </router-link>
        </span>
      </div>
    </fieldset>
  </form>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Register",
  data() {
    return {
      errors: [],
      user: {
        username: "",
        password: ""
      },
      confirmPassword: ""
    };
  },
  computed: {
    isValid() {
      return (
        this.validUsername() && this.validPassword() && this.matchingPasswords()
      );
    },
    ...mapState("users", { loading: "isCreatePending" })
  },
  methods: {
    handleError(e) {
      console.error("User Registration Error: ", e);
      if (e.name === "NotAuthenticated") {
        this.$router.push("/login");
      }
    },
    register(evt) {
      if (this.validForm()) {
        console.log("submitting registration form");
        // create user instance
        const { User } = this.$FeathersVuex;
        console.log("User: ", User);
        console.log("this.user: ", this.user);
        const user = new User(this.user);
        console.log("user: ", user);
        user
          .save()
          .then(user => {
            console.log("User created ", user);
            this.$router.push("/login");
          })
          .catch(e => {
            this.handleError(e);
          });
      }
      evt.preventDefault();
    },
    validForm() {
      // form has html5 validation
      // do some js validation as backup
      let err = (this.errors = []);
      if (!this.user.username) {
        err.push("Username is required.");
      } else if (!this.validUsername()) {
        err.push("Username must have 2 to 18 letters, numbers or spaces.");
      }
      if (!this.user.password) {
        err.push("Password is required.");
      } else if (!this.validPassword()) {
        err.push("Password must have 4 to 18 characters.");
      }
      if (!this.matchingPasswords()) {
        err.push("Both passwords must match.");
      }
      return err.length === 0;
    },
    validUsername() {
      var re = /^[0-9A-Za-z][0-9A-Za-z ]{0,16}[0-9A-Za-z]$/;
      return re.test(this.user.username);
    },
    validPassword() {
      var re = /^.{4,18}$/;
      return re.test(this.user.password);
    },
    matchingPasswords() {
      return this.user.password === this.confirmPassword;
    }
  }
};
</script>

<style scoped>
#register-form {
  margin-top: 5em;
}
.warning {
  margin-left: 5px;
  font-size: 0.65rem;
  color: #e67d09;
}
.errors {
  font-size: 0.85rem;
  color: #e67d09;
}
ul {
  margin: 0 -1em 1em 0;
}
.login {
  margin-left: 1em;
  font-size: 0.85rem;
  color: #999;
  font-style: italic;
}
</style>
