import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/home_page'
        },
        {
            path: '/commonLogin',
            component: () => import(/* webpackChunkName: "login" */ '../components/commonLogin.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/register',
            // name: 'register',
            component: () => import('../components/Register.vue'),
            meta: { title: '注册' }
        },
        {
            path: '/',
            name: 'common_index',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '资产平台' },
            children: [
                {
                    path: '/home_page',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Home_page.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/warehouse',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Warehouse.vue'),
                    meta: { title: '查看仓库' }
                },

                {
                    path: '/check',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Check.vue'),
                    meta: { title: '资产盘点' }
                },

                {
                    // 图片上传组件
                    path: '/trace',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Trace.vue'),
                    meta: { title: '资产操作记录' }
                },

                {
                    // vue-schart组件
                    path: '/in',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/In.vue'),
                    meta: { title: '资产入库申请' }
                },
                {
                    path: '/out',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/Out.vue'),
                    meta: { title: '资产出库列表' }
                },

                {
                    path: '/self_setting',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/Self_setting.vue'),
                    meta: { title: '个人中心' }
                },

                // {
                //     path: '/explain',
                //     component: () => import(/* webpackChunkName: "donate" */ '../components/page/Explain.vue'),
                //     meta: { title: '系统说明' }
                // },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                }
            ]
        },

        {
            path: '*',
            redirect: '/404'
        }
    ]
});
