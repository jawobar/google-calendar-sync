import Vue from "vue";
import Buefy from "buefy";
import App from "./App.vue";

import "buefy/dist/buefy.css"
import i18n from './i18n'

import { store } from "./store/store";

Vue.config.productionTip = false;

Vue.use(Buefy);

new Vue({
    store,
    i18n,
    render: h => h(App)
}).$mount("#app");
