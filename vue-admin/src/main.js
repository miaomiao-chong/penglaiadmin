import Vue from 'vue'
import VueLazyload from 'vue-lazyload'


import 'normalize.css/normalize.css' // a modern alternative to CSS resets

// import Element from 'element-ui'
import {
  Card,
  Button,
  Table,
  TableColumn,
  Form,
  FormItem,
  Input,
  Pagination,
  Switch,
  Tag,
  Radio,
  Row,
  Dialog,
  Col,
  Dropdown,
  Breadcrumb,
  Menu,
  MenuItem,
  Submenu,
  Popover,
  Popconfirm,
  DropdownMenu,
  DropdownItem,
  Upload,
  BreadcrumbItem,
  InputNumber,
  
} from 'element-ui'
Vue.component(Card.name, Card)
// Vue.component(.name, Card)
Vue.component(Button.name, Button)
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)
Vue.component(Pagination.name, Pagination)
Vue.component(Switch.name, Switch)
Vue.component(Tag.name, Tag)
Vue.component(Radio.name, Radio)
Vue.component(Row.name, Row)
Vue.component(Dialog.name, Dialog)
Vue.component(  Col.name,   Col)
Vue.component(  Dropdown.name,   Dropdown)
Vue.component(  DropdownMenu.name,   DropdownMenu)
Vue.component(  DropdownItem.name,   DropdownItem)
Vue.component(  Breadcrumb.name,   Breadcrumb)
Vue.component(  Menu.name,   Menu)
Vue.component(  MenuItem.name,   MenuItem)
Vue.component(  Submenu.name,   Submenu)
Vue.component(  Popover.name,   Popover)
Vue.component(  Popconfirm.name,   Popconfirm)
Vue.component(  Upload.name,   Upload)
Vue.component(  BreadcrumbItem.name,   BreadcrumbItem)
Vue.component(  InputNumber.name,   InputNumber)

import { Message,Loading } from 'element-ui'

// Vue.use(Loading)
// Vue.use(Message)
// 不要用Vue.use  ！！！ 会自动执行一次   弹出一个空框框
Vue.prototype.$message = Message
Vue.prototype.$loading = Loading



import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }



Vue.use(VueLazyload, {
  loading: require('@/assets/loading.jpg'),
  error: require('@/assets/wuneirong.png')
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
