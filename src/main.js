import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

// import Vue from "vue";
// import wrap from "@vue/web-component-wrapper";
// import VueWebComponent from "./App";

// const CustomElement = wrap(Vue, VueWebComponent);

// window.customElements.define("my-custom-element", CustomElement);
