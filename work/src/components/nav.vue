<template>
  <div class="menu_view">
    <a-spin :spinning="spinning">
      <a-menu
        mode="inline"
        :defaultSelectedKeys="defaultKey"
        :defaultOpenKeys="defaultOpenList"
      >
        <a-menu-item key="index">
          <template>
            <router-link to="/index" active-class="active" exact>
              <a-icon type="home"/><span>{{$t('nav.home')}}</span>
            </router-link>
          </template>
        </a-menu-item>
        <a-sub-menu v-for="f in menuList"
                    v-if="JSON.stringify(f.children)!=='[]'&&JSON.stringify(f.children)!=='{}'&&f.enable"
                    :key="f.name"
        >
          <span slot="title"><a-icon :type="f.icon" v-if="f.icon !== ''"/><span>{{f.name}}</span></span>
          <a-menu-item v-for="k in f.children" :key="k.name" v-if="k.enable">
            <template>
              <router-link :to="k.link" active-class="active" exact>{{k.name}}</router-link>
            </template>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-spin>
  </div>
</template>

<script>
import urls from '@/config/api'
import { postToken } from '@/config/extendAXIOS'
import langList from '@/config/permMenuConfig.js'
export default {
  name: 'adminNav',
  data () {
    return {
      langList,
      spinning: false,
      menuList: [],
      defaultKey: [],
      defaultOpenList: []
    }
  },

  created () {
    let vm = this
    let userId = sessionStorage.getItem('sysUserId')
    let lang = localStorage.getItem('lang')// 获取当前客户端选择的语言
    let countryCode = vm.langList.find(item => item.code === lang).countryCode// 在国家语言包LIST里遍历出countryCode
    let params = {
      userId: userId,
      countryCode: countryCode
    }
    vm.spinning = true
    postToken(urls.getMenuByloginUser, params).then(res => {
      if (res.data.code === '10000') {
        vm.menuList = res.data.data
        // 根据当前路由，去menulist中遍历出对应的一项
        let openList = vm.routeExact === 'index' ? 'index' : vm.menuList.find(item => item.children.find(k => k.link === vm.routeExact))
        if (openList !== 'index') { // 设置默认展开的菜单
          vm.defaultOpenList.push(openList.name)
          let menuCount = openList.children.find(item => item.link === vm.routeExact).name
          vm.defaultKey.push(menuCount) // 默认选中项处理
        } else { // 当前路径是index时
          vm.defaultOpenList.push('index')
          vm.defaultKey.push('index')
        }
        let str = JSON.stringify(res.data.data)
        sessionStorage.setItem('user/menu', str)
        vm.spinning = false
      } else {
        vm.$message.error(vm.$t('nav.getMenuFalse'))
      }
    }, () => {
      vm.$message.error(vm.$t('nav.getMenuFalse'))
    })
  },
  mounted () {
    let session = sessionStorage.getItem('user/menu')
    session = JSON.parse(session)
    this.menuList = session
  },
  computed: {
    routeExact: function () {
      let arr = this.$route.path.split('/')
      if (arr[1] === '' || arr[1] === 'index') {
        return 'index'
      } else {
        return arr[1]
      }
    }
  }
}
</script>

<style scoped>
.menu_view{
  width: calc(100% + 15px);
  height: calc(100vmin - 64px);
  overflow-y: scroll;
}
</style>
