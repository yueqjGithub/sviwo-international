<template>
  <div class="login-bg">
    <div class="login-cont">
      <div class="loginMode">
        <a-row>
          <a-col :span="14" :offset="6">
            <img src="../assets/img/logo.png" alt="" class="logo-login">
            <h4>{{$t('login.title')}}</h4>
          </a-col>
        </a-row>
        <a-spin :spinning="spinning">
          <a-form>
            <a-form-item
              :label="$t('login.userName')"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 14 }"
            >
              <a-input placeholder="userName" v-model.trim="userName" ref="userNameInput">
                <a-icon
                  slot="prefix"
                  type="user"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-item>
            <a-form-item
              :label="$t('login.password')"
              :label-col="{ span: 6}"
              :wrapper-col="{ span: 14 }"
            >
              <a-input placeholder="password" v-model.trim="password" ref="userNameInput" type="password">
                <a-icon
                  slot="prefix"
                  type="lock"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-item>
            <!--        验证码-->
            <a-form-item
              :wrapper-col="{ span: 17, offset: 6 }"
            >
              <div class="qrcode">
                <a-input placeholder="Verification" v-model.trim="loginVercode" class="qrcodeInput"></a-input>
                <img :src="getVercode" alt="" class="qrcodeImg" @error="qrcodeFalse">
                <a-button size="small" icon="reload" shape="circle" class="qrcodeBtn" @click.prevent="refreshVcode"></a-button>
              </div>
            </a-form-item>
            <!--        验证码-->
            <a-form-item
              :wrapper-col="{ span: 14, offset: 6 }"
            >
<!--              <a-button-->
<!--                :style="{'backgroundColor': 'none', 'backgroundImage': 'url(anniu)'}"-->
<!--                block-->
<!--                html-type="submit"-->
<!--                @click = 'login'-->
<!--              >-->
<!--                {{$t('login.login')}}-->
<!--              </a-button>-->
              <button class="login-btn" @click = 'login'><span>{{$t('login.login')}}</span></button>
            </a-form-item>
            <a-form-item
              :wrapper-col="{ span: 14, offset: 6}"
            >
              <div class="login_bottom">
                <div class="login_bottom_div">
                  <a-checkbox
                    @change="needRememberChange"
                    :default-checked="true"
                  >
                    {{$t('login.remember')}}
                  </a-checkbox>
                </div>
                <div class="login_bottom_div">
                  <a-select @change="handleChange" :placeholder="$t('login.choseLang')" size="small">
                    <a-select-option v-for="k in langList" :value="k.code" :key="k.index">{{k.name}}</a-select-option>
                  </a-select>
                </div>
              </div>
            </a-form-item>
          </a-form>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script>
import urls from '@/config/api.js'
import langList from '@/config/permMenuConfig.js'
// import logo from '@/assets/img/anniu.png'
export default {
  name: 'login',
  data () {
    return {
      anniu: '../assets/img/anniu.png',
      userName: '',
      password: '',
      loginVercode: '',
      getVercode: urls.vercode,
      vercodeHost: urls.vercode,
      spinning: false,
      needRemember: true,
      langList: langList
      // test: ''
    }
  },
  // created () {
  //   let j = [{name: '11', code: 11}, {name: '22', code: 11}]
  //   this.test = JSON.stringify(j)
  // },
  mounted () {
    let vm = this
    let user = localStorage.getItem('userInfo')
    if (user) {
      user = JSON.parse(user)
      vm.userName = user.sysUserName
      vm.password = user.sysUserPassword
    }
    let localLang = localStorage.getItem('lang') || 'EN'
    localStorage.setItem('lang', localLang)
    let localCountryCode = localStorage.getItem('countryCode') || 'US'
    localStorage.setItem('countryCode', localCountryCode)
    // 进入登陆页立即清空Token防止再进入
    vm.refreshVcode()
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('sysUserId')
    sessionStorage.removeItem('countryCode')
  },
  methods: {
    // 验证码加载失败
    qrcodeFalse () {
      let vm = this
      vm.$message.error(vm.$i18n.t('login.qrcodeFalse'))
    },
    // 刷新验证码
    refreshVcode: function () {
      let vm = this
      vm.getVercode = vm.vercodeHost + '?d=' + Math.random()
    },
    // 记住我
    needRememberChange (e) {
      this.needRemember = e.target.checked
    },
    // 语言切换
    handleChange (value) {
      this.$i18n.locale = value
      localStorage.setItem('lang', value)
      let langCode = this.langList.find(item => item.code === value).countryCode
      localStorage.setItem('countryCode', langCode)
    },
    // 登陆
    login () {
      let vm = this
      let params = {
        sysUserName: this.userName,
        sysUserPassword: this.password,
        verificationCode: this.loginVercode
      }
      // 非空验证
      if (vm.userName === '') {
        vm.$message.error(vm.$i18n.t('login.userNameNull'))
        return false
      }

      if (vm.password === '') {
        vm.$message.error(vm.$i18n.t('login.passwordNull'))
        return false
      }

      if (vm.loginVercode === '') {
        vm.$message.error(vm.$i18n.t('login.loginVercodeNull'))
        return false
      }
      vm.spinning = true // 加载中
      let cCode = localStorage.getItem('lang')
      this.$axios({
        url: urls.login,
        method: 'post',
        data: params,
        transformRequest: [function (data) {
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }],
        timeout: 15000,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'lang': cCode
        }
      }).then(res => {
        vm.spinning = false
        let code = res.data.code
        if (code === '10015') {
          let token = res.headers.token
          sessionStorage.setItem('token', token) // 保存token
          sessionStorage.setItem('nickName', res.data.data.sysUserName) // 保存昵称
          sessionStorage.setItem('sysUserId', res.data.data.sysUserId) // 保存用户id
          sessionStorage.setItem('countryCode', res.data.data.countryCode) // 保存用户国家编码
          if (vm.needRemember) { // 记住我功能
            let opt = JSON.stringify(params)
            localStorage.setItem('userInfo', opt)
          } else {
            localStorage.removeItem('userInfo')
          }
          vm.$message.success(vm.$i18n.t('login.success'))
          setTimeout(() => {
            vm.$router.push({'path': '/'})
          }, 1500)
        } else {
          vm.$message.error(res.data.msg)
        }
        // else if (code === '10083') {
        //   vm.$message.error(vm.$i18n.t('login.vercodeError'))
        // } else {
        //   vm.$message.error(vm.$i18n.t('login.loginFalse'))
        // }
      }).catch(() => {
        vm.spinning = false
        vm.$message.error(vm.$i18n.t('login.loginFalse'))
      })
    }
  }
}
</script>

<style scoped>
@media screen and (min-width: 1400px) {
  .loginMode {
    width: 25%;
  }
}
.loginMode{
  position: absolute;
  width: 36%;
  /* background: #ffffff; */
  max-height: 90%;
  /* top: 10vmin; */
  left: 61.5%;
  top: 50%;
  transform: translate(0,-50%);
}
h2{
  text-align: center;
}
.login_bottom{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.login_bottom_div{
  max-width: 100%;
  min-width: 50%;
}
.qrcode{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.qrcodeInput{
  flex: 7;
}
.qrcodeImg{
  flex: 7;
}
.qrcodeBtn{
  /*flex: 3;*/
  margin-left: 3px;
}
/*-----------------new--------------------*/
  .login-bg{
    width: 100%;
    height: 100vmin;
    background-image: url("../assets/img/bg.png");
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-cont{
    width: 62.5%;
    height: 75vmin;
    position: relative;
    background-image: url("../assets/img/baikuang.png");
    background-size: 100% 100%;
  }
  .ant-form-item{
    margin-bottom: 16px;
  }
  .logo-login{
    display: inline-block;
    margin: 12px auto;
    max-height: 24px;
  }
  .login-btn{
    width: 100%;
    outline: none;
    border: none;
    height: 32px;
    line-height: 32px;
    color: #fff;
    background-color: rgba(0,0,0,0);
    background-image: url("../assets/img/anniu.png");
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
    cursor: pointer;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 16px;
  }
  .login-btn:hover{
    transition: filter .3s;
    filter: brightness(1.1);
  }
</style>
