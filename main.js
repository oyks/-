import Vue from 'vue'
import App from './App'

import Http from './common/request/http.js'
import api from './common/request/api/api.js'
import tool from './common/utils/tools.js'
import VueClipboard from 'vue-clipboard2' // 复制粘粘
import uView from 'uview-ui'

Vue.config.productionTip = false
Vue.prototype.Http = Http
Vue.prototype.api = api
Vue.prototype.tool = tool
Vue.use(VueClipboard);
Vue.use(uView);


App.mpType = 'app'

//不显示console.log
// if (uni.getSystemInfoSync().platform !== "devtools") {
// 	console.log = () => {}
// }

const app = new Vue({
    ...App
})
app.$mount()
