import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '主页', icon: 'dashboard', affix: true }
      }
    ]
  }

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  {
    path: '/a_s_r_manage',
    component: Layout,

    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/ars/list'),
        meta: { title: '景点/餐厅/商店管理', icon: 'edit', roles: ['commonadmin', 'superadmin'] }
      },
      {
        path: 'upload',
        name: 'upload',
        hidden: true,
        component: () => import('@/views/ars/upload'),
        meta: { title: '上传', roles: ['commonadmin', 'superadmin'], activeMenu: '/a_s_r_manage/list' }
      }
    ]
  },

  {
    path: '/b_c_manage',
    component: Layout,
    // redirect: '/b_c_manage/country',
    meta: { title: '公告/介绍管理', icon: 'form', roles: ['commonadmin', 'superadmin'] },
    children: [
      {
        path: 'country',
        name: 'country',
        component: () => import('@/views/bulletin-country/countryintro'),
        meta: { title: '乡村介绍', icon: 'edit', roles: ['commonadmin', 'superadmin'] }
      },
      {
        path: 'bulletin',
        name: 'bulletin',
        component: () => import('@/views/bulletin-country/bulletin'),
        meta: { title: '公告', icon: 'edit', roles: ['commonadmin', 'superadmin'] }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'edit',
        name: 'user',
        component: () => import('@/views/edit-admin/index'),
        meta: { title: '人员管理', icon: 'user', roles: ['superadmin'] }
      }
    ]
  },
  {
    path: '/password',
    component: Layout,
    children: [
      {
        path: 'edit',
        name: 'editpassword',
        component: () => import('@/views/changepassword/changepassword'),
        meta: { title: '修改密码', icon: 'password', roles: ['commonadmin', 'superadmin'] }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
