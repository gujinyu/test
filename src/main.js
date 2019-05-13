// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// import iView from 'iview';
// import 'iview/dist/styles/iview.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/icon/iconfont.css';
import router from './router';
import Resource from 'vue-resource';
import App from './App';
import {
    global
} from '@/utils/Global';
// Vue.use(iView);
Vue.use(ElementUI);
Vue.use(Resource);
Vue.config.productionTip = false;
// 拦截器 每个请求加上user_id
Vue.http.interceptors.push(request => {
    if (request.method === 'POST' && !request.body['noIntercept']) {
        if (sessionStorage.userid) {
            request.body['user_id'] = sessionStorage.userid;
        }
    }
});
Vue.prototype.global = global;
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {
        App
    }
});
