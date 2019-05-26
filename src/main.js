import Vue from "vue";
import VueGoogleApi from 'vue-google-api'
import BootstrapVue from "bootstrap-vue"
import App from "./App.vue";

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import i18n from './i18n'

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

const config = {
  apiKey: '',
  clientId: '',
  scope: 'https://www.googleapis.com/auth/calendar.readonly',
  discoveryDocs: [ 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest' ]
};
Vue.use(VueGoogleApi, config);

new Vue({
  i18n,
  render: h => h(App)
}).$mount("#app");
