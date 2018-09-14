<template>
  <div>
    <SignUp
      @submit="submit($event)"
      v-model="signupDetails">
    </SignUp>

    <br />
    <button @click="facebook">Sign in with Facebook</button>

    <br />
    <button @click="logout">Logout</button>

    <div>
      <h1>Login Details</h1>
      {{ JSON.stringify(loginDetails, null, 2) }}
    </div>

    <div>
      <h1>Session Details</h1>
      {{ JSON.stringify(sessionDetails, null, 2) }}
    </div>
  </div>
</template>

<script>
import { isEmptyObject } from "@/lib/utils";
import AuthService from "@/lib/Auth/AuthService";
import SignUp from "@/components/SignUp";

const auth = new AuthService();

export default {
  components: { SignUp },
  data() {
    return {
      signupDetails: {},
      loginDetails: {},
      sessionDetails: {},
      authHash: window.location.hash || {}
    };
  },
  methods: {
    submit(e) {
      e.preventDefault();
      const { email, password } = this.signupDetails;
      auth.login(email, password);
    },
    facebook() {
      auth.loginWithFacebook();
    },
    logout() {
      auth.logout("http://localhost:8080/");
    }
  },
  created() {
    auth.parseHash(this.authHash, user => {
      if (isEmptyObject(user) || user.hasOwnProperty("error")) {
        console.log(user);
      } else {
        this.loginDetails = user;
      }
    });

    auth.checkSession(user => {
      if (user.hasOwnProperty("error")) {
        console.log(user);
      } else {
        this.sessionDetails = user;
      }
    });
  }
};
</script>
