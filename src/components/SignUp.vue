<template>
    <form @submit="submit($event)">
    <div>
      <label name="name">Your name </label>
      <input type="text" v-model="name">
    </div>
    <div>
      <label name="email">Your email </label>
      <input type="text" v-model="email">
    </div>
    <div>
      <label name="password">Your password </label>
      <input type="password" v-model="password">
    </div>
    <div>
      <input type="submit" value="Reserve my spot">
    </div>
  </form>
</template>

<script>
export default {
  params: ["value"],
  data() {
    return {
      name: "",
      email: "",
      password: ""
    };
  },
  methods: {
    submit(e) {
      this.$emit("input", {
        name: this.name,
        email: this.email,
        password: this.password
      });
      this.$emit("submit", e);
    }
  },
  watch: {
    email() {
      this.$emit("input", {
        name: this.name,
        email: this.email,
        password: this.password
      });
    }
  }
};
</script>

<style>
</style>
