import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import axios from "./backend/vue-axios";

import './styles/common/styles.scss';

Vue.config.productionTip = false

new Vue({
    vuetify,
    router,
    axios,
    render: h => h(App)
}).$mount('#app')