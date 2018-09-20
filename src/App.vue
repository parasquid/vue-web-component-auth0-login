<template>
  <div>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
      class="spinner"
      ref="spinner"
    >
    <SignUp
      @submit="submit($event)"
      v-model="signupDetails">
    </SignUp>

    <br />
    <button @click="facebook">Sign in with Facebook</button>

    <br />
    <button @click="logout">Logout</button>

    <br />
    <button @click="changePassword">Change Password</button>

    <div>
      <h1>Session Details</h1>
      {{ JSON.stringify(sessionDetails, null, 2) }}
    </div>
  </div>
</template>

<script>
import { AUTH_CONFIG } from "@/config/auth0-variables";
import AuthService from "@/lib/auth/auth-service";
import SilentAuthenticator from "@/lib/auth/silent-authenticator.js";
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
      this.$refs.spinner.style.display = "block";
      const { email, password } = this.signupDetails;
      const iframe = new SilentAuthenticator({
        email: email,
        password: password,
        domain: AUTH_CONFIG.domain,
        clientId: AUTH_CONFIG.clientId,
        redirectUri: "http://localhost:8080/callback.html",
        callback: r => {
          auth.parseHash(r, user => {
            this.sessionDetails = user;
            this.$refs.spinner.style.display = "none";
            iframe.destroy();
          });
        }
      });
    },
    facebook() {
      auth.loginWithFacebook();
    },
    logout() {
      auth.logout("http://localhost:8080/");
    },
    changePassword() {
      auth.changePassword(this.signupDetails.email, r => {
        console.log(r);
      });
    }
  },
  created() {
    auth.checkSession(user => {
      if (user.hasOwnProperty("error")) {
        console.log(user);
      } else {
        this.sessionDetails = user.idTokenPayload;
        this.signupDetails = user.idTokenPayload;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
img.spinner {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
