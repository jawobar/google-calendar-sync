import Vue from "vue";
import BootstrapVue from "bootstrap-vue"
import App from "./App.vue";

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import i18n from './i18n'

import { store } from "./store/store";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

new Vue({
    store,
    i18n,
    render: h => h(App)
}).$mount("#app");
