<template>
  <div>
    <a-form>
      <a-form-item
        :label="$t('roleList.roleName')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.roleName" :disabled="doEdit"></a-input>
      </a-form-item>
<!--      <a-form-item-->
<!--        :label="$t('roleList.name')"-->
<!--        :label-col="labelCol"-->
<!--        :wrapper-col="wrapperCol"-->
<!--      >-->
<!--        <a-input v-model.trim="options.name" :disabled="doEdit"></a-input>-->
<!--      </a-form-item>-->
      <a-form-item
        :label="$t('roleList.remark')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.remark" :disabled="doEdit"></a-input>
      </a-form-item>
      <a-form-item
        :style="{textAlign: 'center'}"
      >
        <a-button type="primary" v-if="showSubmit" @click="doSubmit">{{$t('addCountry.submit')}}</a-button>
        <a-button type="primary" @click="toEdit" v-if="view === 2 && !showSubmit">{{$t('addCountry.edit')}}</a-button>
      </a-form-item>
    </a-form>
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
      countryList: cList2(),
      lang: lang,
      doEdit: false,
      showSubmit: true,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      },
      options: {
        roleName: '',
        // name: '',
        createUserId: '',
        remark: ''
      }
    }
  },
  // created () {
  //   let vm = this
  //   // let countryCode = sessionStorage.getItem('countryCode')
  //   let params = {
  //     pageSize: 500,
  //     currentPage: 1
  //     // countryCode: countryCode
  //   }
  //   postToken(urls.getPermission, params).then(res => {
  //     let code = res.data.code
  //     if (code === '10000') {
  //       let list = res.data.data.data
  //       for (let k in list) {
  //         vm.allRole.push({
  //           key: list[k].roleId,
  //           title: list[k].roleName
  //         })
  //       }
  //     } else {
  //       vm.$message.error(vm.$i18n.t('roleList.getDataFalse'))
  //     }
  //   }).catch(_ => {
  //     vm.$message.error(vm.$i18n.t('roleList.getDataFalse'))
  //   })
  //   // console.log(vm.allRole)
  // },
  mounted () {
    let vm = this
    if (this.view === 2) {
      vm.doEdit = true
      vm.showSubmit = false
      for (let k in vm.init) {
        if (vm.options.hasOwnProperty(k)) {
          vm.options[k] = vm.init[k]
        }
      }
      // 获取角色已有权限
      // let params = {
      //   sysUserId: vm.init.sysUserId
      // }
      // postToken(urls.findRoleIdBySysUserId, params).then(res => {
      //   let code = res.data.code
      //   if (code === '10000') {
      //     let list = res.data.data
      //     for (let k in list) {
      //       vm.userRole.push(list[k].roleId)
      //     }
      //   } else {
      //     vm.$message.error(vm.$i18n.t('roleList.getUserRoleFalse'))
      //   }
      // }).catch(_ => {
      //   vm.$message.error(vm.$i18n.t('roleList.getUserRoleFalse'))
      // })
      // console.log(vm.userRole)
    }
  },
  methods: {
    toEdit () {
      this.showSubmit = true
      this.doEdit = false
    },
    // handleChange (nextTargetKeys, direction, moveKeys) {
    //   this.userRole = nextTargetKeys
    // },
    // handleSelectChange (sourceSelectedKeys, targetSelectedKeys) {
    //   this.selectedKey = [...sourceSelectedKeys, ...targetSelectedKeys]
    // },
    doSubmit () {
      let vm = this
      let sysUid = sessionStorage.getItem('sysUserId')
      let param = {
        roleName: vm.options.roleName,
        // name: vm.options.name,
        createUserId: sysUid
      }
      for (let k in param) {
        if (param[k] === '') {
          vm.$message.error(vm.$i18n.t('addCountry.needOptions'))
          return false
        }
      }
      if (vm.options.remark !== '') {
        param.remark = vm.options.remark
      }
      if (vm.view === 2) {
        param['updateUserId'] = sysUid
        param['roleId'] = vm.init.roleId
      }
      if (vm.view === 1) {
        param['createUserId'] = sysUid
      }
      postToken(urls.saveOrUpdateRole, param).then(res => {
        let code = res.data.code
        if (code === '10000') {
          vm.$message.success(vm.$i18n.t('common.success'))
          setTimeout(_ => {
            vm.$router.go(0)
          }, 1500)
        } else {
          vm.$message.error(vm.$i18n.t('common.false'))
        }
      }).catch(_ => {
        vm.$message.error(vm.$i18n.t('common.false'))
      })
    }
  }
}
</script>

<style scoped>

</style>
