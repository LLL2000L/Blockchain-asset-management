import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import axios from 'axios';
import VueI18n from 'vue-i18n';
import ECharts from 'vue-echarts';

import router from './router/index';
import Web3 from 'web3';

import { messages } from '../src/components/master/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
// import './components/common/directives';
import 'babel-polyfill';
import './utils/cookie';

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
var mcount = 0;
var con;
Vue.prototype.$loginsave = function (tcon) {
    mcount++;
    con = tcon;
};
Vue.prototype.$getlogin = function () {
    console.log(mcount);
    return con;
};

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | asset-manage-system`;
    const role = localStorage.getItem('ms_username');

    // 判断|要去的路由是否你要去的那个页面(路由导航守卫)
    if (!role && to.path !== '/masterLogin') {
        //表示如果没有输入名字，去的路径不是登录页，则。。
        // next('/login');
        if (to.path === '/register') {
            next();
        } else {
            next('/masterLogin');
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
