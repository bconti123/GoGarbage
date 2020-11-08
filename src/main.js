import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import router from './routes'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

Vue.use(VueAxios, axios);

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_MAP_KEY
  }
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
