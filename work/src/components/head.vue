<template>
  <div class="head">
    <div class="head-left">
      <div class="logo">
        SVIWO
      </div>
      <span class="version">
        v1.0.0
      </span>
      <div class="changeLang">
        <a-dropdown>
          <a href="#" class="lang-head">
            language <a-icon type="down" />
          </a>
          <a-menu slot="overlay" @click="handleChange">
            <a-menu-item v-for="k in langList" :key="k.code">
              {{k.name}}
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
    <div class="head-right">
      <div class="nickDiv">
        {{$t('head.welcome')}}
        <span class="nickName">{{nickName}}</span>
      </div>
      <a-button ghost size="small" @click="logout">{{$t('head.logout')}}</a-button>
    </div>
  </div>
</template>

<script>
import urls from '@/config/api'
import { postToken } from '../config/extendAXIOS'
import langList from '@/config/permMenuConfig.js'

export default {
  name: 'top',
  data () {
    return {
      nickName: '',
      langList: langList
    }
  },
  mounted () {
    let nickName = sessionStorage.getItem('nickName')
    this.nickName = nickName
  },
  methods: {
    handleChange ({key}) {
      this.$i18n.locale = key
      localStorage.setItem('lang', key)
      let langCode = this.langList.find(item => item.code === key).countryCode
      localStorage.setItem('countryCode', langCode)
      // this.$router.push({'path': '/index'})
      this.$router.go(0)
    },
    logout () {
      postToken(urls.logout, null).then(res => {
        this.$router.push({path: '/login'})
      }, _ => {
        this.$router.push({path: '/login'})
      })
    }
  }
}
</script>

<style scoped>
.head{
  width: 100%;
  height: 64px;
  display: flex;
  color: rgba(255, 255, 255, 0.65);
  justify-content: space-between;
  align-items: center;
}
.head-left{
  display: flex;
  justify-content: space-around;
  align-items: baseline;
  max-width: 50%;
}
.logo{
  font-size: .24rem;
  color: #ffffff;
}
.version{
  font-size: .12rem;
  color: rgba(255, 255, 255, 0.65);
  margin-left: .08rem;
}
.nickName{
  color: #fff;
}
.head-right{
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.nickDiv{
  margin-right: .08rem;
}
.changeLang{
  margin-left: .08rem;
}
.lang-head{
  color: rgba(255, 255, 255, 0.65);
  list-style-type: none;
}
</style>
