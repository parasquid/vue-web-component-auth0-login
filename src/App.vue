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

    <div>
      <h1>Session Details</h1>
      {{ JSON.stringify(sessionDetails, null, 2) }}
    </div>
  </div>
</template>

<script>
import AuthService from "@/lib/auth/auth-service";
import SilentAuthentication from "@/lib/auth/silent-authentication.js";
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
      new SilentAuthentication({
        email: email,
        password: password,
        redirectUri: "http://localhost:8080/callback.html",
        callback: r => {
          auth.parseHash(r, user => {
            this.sessionDetails = user;
            this.$refs.spinner.style.display = "none";
          });
        }
      });
    },
    facebook() {
      auth.loginWithFacebook();
    },
    logout() {
      auth.logout("http://localhost:8080/");
    }
  },
  created() {
    auth.checkSession(user => {
      if (user.hasOwnProperty("error")) {
        console.log(user);
      } else {
        this.sessionDetails = user;
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
