<template>
  <div>
    <a-form>
      <a-form-item
        :label="$t('userList.userName')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :validate-status="rules.unCheck"
        :help="rules.unCheck_msg"
        hasFeedback
      >
        <a-input v-model.trim.lazy="options.sysUserName" :disabled="view === 2" @blur="checkUserName"></a-input>
      </a-form-item>
    </a-form>
    <a-form>
      <a-form-item
        :label="$t('userList.password')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        v-if="view === 1"
      >
        <a-input v-model.trim="options.sysUserPassword" :disabled="doEdit"></a-input>
      </a-form-item>
    </a-form>
    <a-form-item
      :label="$t('carList.countryName')"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :validate-status="rules.ctCheck"
      :help="rules.ctCheckMsg"
    >
      <a-select
        v-model="defaultCountry"
        :disabled="countryCouldModify"
        :style="{width: '100%'}"
        v-if="view === 1"
        :defaultValue="defaultCountry"
        @change="checkCountry"
        has-feedback
        :filterOption="filterCountrySelect"
        showSearch
      >
        <a-select-option v-for="i in countryList" :key="i.locale" :value="i.locale" v-if="lang === 'CN'">{{i.zh}}</a-select-option>
        <a-select-option v-for="i in countryList" :key="i.locale" :value="i.locale" v-if="lang === 'EN'">{{i.en}}</a-select-option>
      </a-select>
      <a-input v-model="init.countryName" :disabled="true" v-if="view === 2"></a-input>
    </a-form-item>
<!--    <a-form-item-->
<!--      :label="$t('userList.mobile')"-->
<!--      :label-col="labelCol"-->
<!--      :wrapper-col="wrapperCol"-->
<!--    >-->
<!--      <a-input v-model.trim="options.mobile" :disabled="doEdit"></a-input>-->
<!--    </a-form-item>-->
<!--    <a-form-item-->
<!--      :label="$t('userList.realName')"-->
<!--      :label-col="labelCol"-->
<!--      :wrapper-col="wrapperCol"-->
<!--    >-->
<!--      <a-input v-model.trim="options.realName" :disabled="doEdit"></a-input>-->
<!--    </a-form-item>-->
    <a-form-item
      :label="$t('userList.remark')"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      v-if="view === 1"
    >
      <a-textarea v-model.trim="options.remark" :disabled="doEdit"></a-textarea>
    </a-form-item>
    <a-form-item
      :label="$t('userList.role')"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-select :defaultValue="defaultValue" style="width: 120px" v-model="defaultValue" :disabled="doEdit">
        <a-select-option v-for="k in allRole" :value="k.roleId" :key="k.roleId">{{k.roleName}}</a-select-option>
      </a-select>
<!--      @scroll="handleScroll"-->
<!--      :render="item=>item.title"-->
<!--      :disabled="disabled"-->
<!--      <a-transfer-->
<!--        :dataSource="allRole"-->
<!--        :titles="[$t('userList.allRole'), $t('userList.curRole')]"-->
<!--        :targetKeys="userRole"-->
<!--        :selectedKeys="selectedKey"-->
<!--        :render="item=>item.title"-->
<!--        @change="handleChange"-->
<!--        @selectChange="handleSelectChange"-->
<!--        :disabled="doEdit"-->
<!--      />-->
    </a-form-item>
    <a-form-item
    :style="{textAlign: 'center'}"
    >
      <a-button type="primary" v-if="showSubmit" @click="doSubmit" :loading="loading" :disabled="loading">{{$t('addCountry.submit')}}</a-button>
      <a-button type="primary" @click="toEdit" v-if="view === 2 && !showSubmit">{{$t('addCountry.edit')}}</a-button>
    </a-form-item>
  </div>
</template>

<script>
import cList from '@/config/countryList'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import { postToken } from '@/config/extendAXIOS'
import urls from '@/config/api'
export default {
  name: 'detail',
  components: {ATextarea},
  props: ['init', 'view'],
  data () {
    const lang = localStorage.getItem('lang')
    const cList2 = () => {
      let list = []
      let code = sessionStorage.getItem('countryCode')
      if (code !== '' && code !== null) {
        list.push(cList.find(item => item.locale === code))
      } else {
        list = cList
      }
      return list
    }
    return {
      cList,
      allRole: [],
      userRole: [],
      selectedKey: [], // 用于变更角色穿梭中被勾选的用
      defaultValue: '',
      defaultCountry: 'all',
      countryCouldModify: false,
      countryList: cList2(),
      lang: lang,
      doEdit: false,
      showSubmit: true,
      loading: false, // 按钮控制
      rules: {
        unCheck: '',
        unCheck_msg: '',
        ctCheck: '',
        ctCheckMsg: ''
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      },
      options: {
        sysUserName: '',
        sysUserPassword: '',
        countryCode: '',
        parentId: '',
        // mobile: '',
        // realName: '',
        createUserId: '',
        sysDepartId: ''
        // remark: ''
      }
    }
  },
  created () {
    let vm = this
    let countryCode = sessionStorage.getItem('countryCode')
    let params = {
      pageSize: 200,
      currentPage: 1,
      countryCode: countryCode === '' ? 'all' : countryCode
    }
    if (vm.view === 1) {
      params['status'] = 1
    }
    postToken(urls.getRole, params).then(res => {
      let code = res.data.code
      if (code === '10000') {
        let list = res.data.data.data
        vm.allRole = list
        if (vm.view === 2) {
          let param1 = {
            sysUserId: vm.init.sysUserId
          }
          postToken(urls.findRoleIdBySysUserId, param1).then(res1 => {
            let code1 = res1.data.code
            if (code1 === '10000') {
              let defaultValue = vm.allRole.find(item => item.roleId === res1.data.data[0].roleId).roleId
              vm.defaultValue = defaultValue
            } else {
              vm.$message.error(vm.$i18n.t('roleList.getUserRoleFalse'))
            }
          }).catch(_ => {
            vm.$message.error(vm.$i18n.t('roleList.getUserRoleFalse'))
          })
        }
      } else {
        vm.$message.error(vm.$i18n.t('roleList.getDataFalse'))
      }
    }).catch(_ => {
      vm.$message.error(vm.$i18n.t('roleList.getDataFalse'))
    })
  },
  mounted () {
    let vm = this
    if (this.view === 2) {
      vm.doEdit = true
      vm.showSubmit = false
      vm.countryCouldModify = true
      for (let k in vm.init) {
        if (vm.options.hasOwnProperty(k)) {
          vm.options[k] = vm.init[k]
        }
      }
    }
    // 国家显示
    let sysCountry = sessionStorage.getItem('countryCode')
    if (sysCountry) {
      vm.defaultCountry = sysCountry
      vm.countryCouldModify = true
    }
  },
  methods: {
    // checkCountry
    checkCountry (value, option) {
      // validateCountry
      let vm = this
      let param = {
        countryCode: value
      }
      postToken(urls.validateCountry, param).then(res => {
        if (res.data.code !== '10000') {
          vm.rules.ctCheck = 'error'
          vm.rules.ctCheckMsg = res.data.msg
        } else {
          vm.rules.ctCheck = ''
        }
      }).catch(_ => {
        vm.rules.ctCheck = 'error'
      })
    },
    // checkUserName
    checkUserName () {
      let vm = this
      if (vm.options.sysUserName === '') {
        vm.rules.unCheck = 'error'
        vm.rules.unCheck_msg = vm.$i18n.t('userList.userNameNull')
        return false
      }
      let param = {
        username: vm.options.sysUserName
      }
      postToken(urls.validateUsername, param).then(res => {
        if (res.data.code === '10045') {
          vm.rules.unCheck = 'success'
        } else {
          vm.rules.unCheck = 'error'
        }
        vm.rules.unCheck_msg = res.data.msg
      }).catch(_ => {
        vm.rules.unCheck = 'error'
      })
    },
    toEdit () {
      this.showSubmit = true
      this.doEdit = false
    },
    handleChange (nextTargetKeys, direction, moveKeys) {
      this.userRole = nextTargetKeys
    },
    handleSelectChange (sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKey = [...sourceSelectedKeys, ...targetSelectedKeys]
    },
    doSubmit () {
      let vm = this
      let sysUid = sessionStorage.getItem('sysUserId')
      let param = {
        // sysUserId: '',
        roleId: vm.defaultValue
        // sysUserName: vm.options.sysUserName,
        // countryCode: vm.defaultCountry === 'all' ? '' : vm.defaultCountry,
        // parentId: sysUid,
        // mobile: vm.options.mobile,
        // realName: vm.options.realName,
        // createUserId: sysUid,
        // sysDepartId: '1'
        // remark: vm.options.remark
      }
      if (vm.rules.unCheck === 'error') {
        vm.$message.error(vm.$i18n.t('userList.uNameDisabled'))
        return false
      }
      if (vm.rules.ctCheck === 'error') {
        vm.$message.error(vm.$i18n.t('userList.countryUnusable'))
        return false
      }
      if (vm.view === 1) {
        param['sysUserPassword'] = vm.options.sysUserPassword
        param['sysUserName'] = vm.options.sysUserName
        param['countryCode'] = vm.defaultCountry === 'all' ? '' : vm.defaultCountry
        param['parentId'] = sysUid
        param['createUserId'] = sysUid
        param['remark'] = vm.options.remark
        if (param['sysUserName'] === '' || param['sysUserPassword'] === '') {
          vm.$message.error(vm.$i18n.t('addCountry.needOptions'))
          return false
        }
      }
      if (vm.view === 2) {
        param['sysUserId'] = vm.init.sysUserId
      }
      vm.loading = true
      postToken(urls.saveOrUpdateUser, param).then(res => {
        let code = res.data.code
        if (code === '10000') {
          let param1 = {
            sysUserId: vm.options.sysUserId,
            roleId: vm.userRole.join(',')
          }
          if (vm.userRole.length > 0) {
            postToken(urls.saveUserRole, param1).then(res1 => {
              let code1 = res1.data.code
              if (code1 === '10000') {
                vm.$message.success(vm.$i18n.t('common.success'))
                vm.loading = false
                setTimeout(_ => {
                  vm.$router.go(0)
                }, 1500)
              } else {
                vm.$message.error(vm.$i18n.t('common.false'))
                vm.loading = false
              }
            }).catch(_ => {
              vm.$message.error(vm.$i18n.t('common.false'))
              vm.loading = false
            })
          } else {
            vm.$message.success(vm.$i18n.t('common.success'))
            vm.loading = false
            setTimeout(_ => {
              vm.$router.go(0)
            }, 1500)
          }
        } else {
          vm.$message.error(vm.$i18n.t('common.false'))
          vm.loading = false
        }
      }).catch(_ => {
        vm.$message.error(vm.$i18n.t('common.false'))
        vm.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
