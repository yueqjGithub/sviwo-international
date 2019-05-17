import Vue from 'vue'
import Router from 'vue-router'
// eslint-disable-next-line
import auth from '@/config/auth'
import NotFound from '@/components/404'
import forbidden from '@/components/403'
import login from '@/components/login'
import index from '@/pages/index/index'
// 司机管理
import driverInfo from '@/pages/driver/driverInfo'
// 账户管理
import sysUser from '@/pages/user/userList'
// 国家配置列表
import countryList from '@/pages/country/countryList'
// 车辆列表
import carList from '@/pages/car/carList'
// 乘客列表
import passenger from '@/pages/passenger/passenger'
// 待审核列表
import audit from '@/pages/audit/auditList'
// 订单列表
import order from '@/pages/order/orderList'
// 角色列表
import sysRole from '@/pages/role/roleList'
// 权限管理
import permList from '@/pages/permission/permList'
// 菜单管理
import menuList from '@/pages/menuManage/menuList'
// 系统参数配置
import dicType from '@/pages/sysConfig/dicType'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {keepAlive: true, layout: false}
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      alias: ['/'],
      meta: {keepAlive: true, layout: true},
      beforeEnter: auth
    },
    { // 司机管理
      path: '/driverInfo',
      name: 'driver',
      component: driverInfo,
      meta: {keepAlive: false, layout: true},
      beforeEnter: auth
    },
    { // 账户列表
      path: '/sysUser',
      name: 'sysUser',
      component: sysUser,
      meta: {keepAlive: false, layout: true},
      beforeEnter: auth
    },
    { // 国家列表
      path: '/countryList',
      name: 'countryList',
      component: countryList,
      meta: {keepAlive: false, layout: true},
      beforeEnter: auth
    },
    { // 车辆列表
      path: '/vehicleList',
      name: 'carList',
      component: carList,
      meta: {keepAlive: false, layout: true},
      beforeEnter: auth
    },
    { // 乘客列表
      path: '/passenger',
      name: 'passenger',
      component: passenger,
      meta: {keepAlive: false, layout: true},
      beforeEnter: auth
    },
    { // 待审核列表
      path: '/audit',
      name: 'audit',
      component: audit,
      meta: {keepAlive: false, layout: true},
      beforeEnter: auth
    },
    { // 订单列表
      path: '/orderList',
      name: 'orderList',
      component: order,
      meta: {keepAlive: false, layout: true},
      beforeEnter: auth
    },
    { // 订单列表
      path: '/sysRole',
      name: 'sysRole',
      component: sysRole,
      meta: {keepAlive: false, layout: true},
      beforeEnter: auth
    },
    { // 权限管理
      path: '/permList',
      name: 'permList',
      component: permList,
      meta: {keepAlive: false, layout: true},
      beforeEnter: auth
    },
    { // 菜单管理
      path: '/menuList',
      name: 'menuList',
      component: menuList,
      meta: {keepAlive: false, layout: true},
      beforeEnter: auth
    },
    { // 系统参数配置
      path: '/dicType',
      name: 'dicType',
      component: dicType,
      meta: {keepAlive: false, layout: true},
      beforeEnter: auth
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound,
      meta: {keepAlive: true, layout: false}
    },
    {
      path: '/403',
      name: 'forbidden',
      alias: ['/401'],
      component: forbidden,
      meta: {keepAlive: true, layout: false}
    },
    {
      path: '*',
      redirect: {name: 'NotFound'}
    }
  ]
})
