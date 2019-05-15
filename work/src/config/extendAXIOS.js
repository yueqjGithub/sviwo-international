import main from '../main'
import { Modal } from 'ant-design-vue'
const axios = require('axios')
const qs = require('qs')

const req = axios.create({
  timeout: 15000,
  transformResponse: [function (data) {
    let info
    if (typeof (data) === 'string') {
      info = JSON.parse(data)
    }
    let code = info.code
    if (code === '30061') { // 拦截权限不足

    }
    return info
  }]
})
axios.defaults.withCredentials = true
req.interceptors.request.use(config => {
  let token = sessionStorage.getItem('token')
  let lang = localStorage.getItem('lang')
  if (token) {
    config.headers['lang'] = lang
    config.headers['token'] = token
    return config
  } else {
    // token不存在操作---清空session
    sessionStorage.setItem('sysUserId', null)
    sessionStorage.setItem('token', null)
    sessionStorage.setItem('menu', {})
    main.$router.push({path: '/login'})
  }
})
req.interceptors.response.use(response => { // 拦截返回
  if (response.data.code === '10076') {
    // console.log('------------------token Time out-----------------------')
    // console.log(main.$i18n.t('common.infoTimeOut'))
    Modal.warning({
      content: main.$i18n.t('common.infoTimeOut'),
      okText: main.$i18n.t('common.ok'),
      onOk () {
        main.$router.push({path: '/login'})
      }
    })
    return false
  }
  return response
}, err => {
  let status = err.response.status
  if (status === 401) {
    main.$router.push({path: '/403'})
  }
  if (status === 403) {
    main.$router.push({path: '/403'})
  }
  if (status === 404) {
    main.$router.push({path: '/404'})
  }
  if (status === 302) {
    main.$router.push({path: '/login'})
  }
  throw status
})

// 带token post
const postToken = (url, params) => {
  return req({
    url: url,
    method: 'post',
    data: qs.stringify(params)
  })
}

export {postToken}
