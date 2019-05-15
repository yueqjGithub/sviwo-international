// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/main.css'
// element
import { Table, TableColumn, DatePicker, button, Select, Option, Upload, Checkbox, Radio,
  CheckboxButton,
  CheckboxGroup,
  Tree
} from 'element-ui'
import eleLang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
// ant-design
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
// 语言包引入
import VueI18n from 'vue-i18n'
import zhCN from './common/lang/zh'
import enUA from './common/lang/en'
// axios
import axios from 'axios'
// mixin
import myMix from '@/config/mixin'
// vuex
import store from '@/store'

locale.use(eleLang)

axios.defaults.withCredentials = true
Vue.prototype.$axios = axios

Vue.use(VueI18n)
Vue.use(Antd)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(button)
Vue.use(Select)
Vue.use(Upload)
Vue.use(Option)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Tree)
Vue.use(Radio)

Vue.config.productionTip = false

Vue.mixin(myMix)

const i18n = new VueI18n({
  locale: localStorage.lang || 'EN', // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale
  messages: {
    'CN': zhCN, // 中文语言包
    'EN': enUA // 英文语言包
  }
})
/* eslint-disable no-new */
let vue = new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: { App },
  template: '<App/>'
})

export default vue
