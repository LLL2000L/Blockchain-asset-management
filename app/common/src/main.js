import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import axios from 'axios';
import VueI18n from 'vue-i18n';
import ECharts from 'vue-echarts';

import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import 'babel-polyfill';

import router from './router';
import Web3 from 'web3';

Vue.config.productionTip = false;
Vue.use(VueI18n);

Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

//全局对象
var con;
Vue.prototype.$loginsave = function (tcon) {
    con = tcon;
};
Vue.prototype.$getlogin = function () {
    return con;
};

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | asset-manage-system`;
    const role = localStorage.getItem('ms_username');
    // const role = localStorage.getItem('user_Type');

    // 判断|要去的路由是否你要去的那个页面(路由导航守卫)
    if (!role && to.path !== '/commonLogin') {
        //表示如果没有输入名字，去的路径不是登录页，则。。
        // next('/login');
        if (to.path === '/register') {
            next();
        } else {
            next('/commonLogin');
        }
    }
    next();
});
Vue.prototype.$axios = axios;
Vue.prototype.$Web3 = Web3;
Vue.component('v-chart', ECharts);
new Vue({
    axios,
    router,
    i18n,
    render: (h) => h(App)
}).$mount('#app');
