import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vueHeadful from "vue-headful";
import Chartkick from 'vue-chartkick';
import Chart from 'chart.js'

Vue.component("vue-headful", vueHeadful);
Vue.use(Chartkick.use(Chart));

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
