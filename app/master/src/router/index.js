import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        // 路由重定向
        {
            path: '/',
            redirect: '/home_page'
        },
        {
            path: '/masterLogin',
            // name: 'login',
            component: () => import('../components/masterLogin.vue'),
            meta: { title: '登录' }
        },

        {
            path: '/register',
            // name: 'register',
            component: () => import('../components/Register.vue'),
            meta: { title: '注册' }
        },

        //
        {
            path: '/',
            component: () => import('../components/master/common/Home.vue'),
            name: 'master_index',
            meta: { title: '资产平台' },
            children: [
                {
                    path: '/home_page',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/master/page/Home_page.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/trace',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/master/page/Trace.vue'),
                    meta: { title: '资产操作记录' }
                },
                {
                    path: '/role_management',
                    component: () => import(/* webpackChunkName: "table" */ '../components/master/page/Role_management.vue'),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/asset_allocationTo',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/master/page/Asset_allocation.vue'),
                    meta: { title: '资产调拨' }
                },

                {
                    path: '/in',
                    component: () => import(/* webpackChunkName: "form" */ '../components/master/page/In.vue'),
                    meta: { title: '资产入库审批' }
                },
                {
                    path: '/out',
                    component: () => import(/* webpackChunkName: "form" */ '../components/master/page/Out.vue'),
                    meta: { title: '资产出库审批' }
                },
                {
                    path: '/warehouse',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/master/page/Warehouse.vue'),
                    meta: { title: '下发资产盘点任务' }
                },
                {
                    path: '/check',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/master/page/Check.vue'),
                    meta: { title: '资产盘点任务列表' }
                },

                {
                    path: '/result',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/master/page/Result.vue'),
                    meta: { title: '资产盘点结果' }
                },

                {
                    path: '/self_setting',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/master/page/Self_setting.vue'),
                    meta: { title: '个人中心' }
                },

                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/master/page/404.vue'),
                    meta: { title: '404' }
                }

                // {
                //     path: '/explain',
                //     component: () => import(/* webpackChunkName: "donate" */ '../components/master/page/Explain.vue'),
                //     meta: { title: '系统说明' }
                // }
            ]
        },

        {
            path: '*',
            redirect: '/404'
        }
    ]
});
