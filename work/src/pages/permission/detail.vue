<template>
  <div>
    <a-form>
      <a-form-item
        v-for="k in countryArray"
        :key="k.index"
        :label="cList.find(item => item.locale === k.countryCode).zh"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        v-if="view === 1"
      >
<!--        <a-input v-model.trim="options.permName" :disabled="doEdit"></a-input>-->
        <a-input v-model.lazy="k.value"></a-input>
      </a-form-item>
      <a-form-item
        label="资源路径"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.lazy="options.permUrl" :disabled="doEdit"></a-input>
      </a-form-item>
      <a-form-item
        label="父级资源"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        v-if="view === 1"
      >
        <a-select
          v-model="options.parentId"
          :disabled="doEdit"
        >
<!--          <a-select-option :key="0">屏蔽</a-select-option>-->
<!--          <a-select-option :key="1">显示</a-select-option>-->
          <a-select-option v-for="k in parent" :key="k.index" :value="k.permId">{{k.permName}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="状态"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        v-if="view === 1"
      >
        <a-select
          v-model="options.permStatus"
          :disabled="doEdit"
          @change="uninHandle"
        >
          <a-select-option :key="0">屏蔽</a-select-option>
          <a-select-option :key="1">显示</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
    <div class="buttonList">
      <a-button type="primary" v-if="showSubmit" @click="editDriver" :loading="isLoading" :disabled="isLoading">{{$t('addCountry.submit')}}</a-button>
      <a-button type="primary" @click="toEdit" v-if="view === 2 && !showSubmit">{{$t('addCountry.edit')}}</a-button>
    </div>
  </div>
</template>

<script>
import { postToken } from '@/config/extendAXIOS'
import urls from '@/config/api'
import cList from '@/config/countryList'
import cArray from '@/config/permMenuConfig.js'
export default {
  name: 'Detail',
  props: ['init', 'view', 'parent'],
  data () {
    const token = sessionStorage.getItem('token')
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
      isLoading: false,
      // 显示保存按钮
      showSubmit: true,
      cList,
      cArray,
      countryList: cList2(),
      lang: lang,
      token: token,
      loading: false,
      doEdit: false, // 修改
      detail: false, // 查看详情
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      // ------
      imgHost: urls.imgHost,
      uploadUrl: urls.uploadImage,
      options: {
        permName: '',
        permUrl: '',
        parentId: '',
        permStatus: undefined
      },
      countryArray: [] // 存放现有国家
    }
  },
  created () {
    let vm = this
    let param = {
      countryCode: ''
    }
    postToken(urls.getCountry, param).then(res => {
      if (res.data.code === '10000') {
        // vm.countryArray = [...res.data.data]
        let response = res.data.data
        for (let k in response) {
          vm.countryArray.push({countryCode: response[k].countryCode, value: ''})
        }
      } else {
        vm.$message.error('获取现有国家列表失败-res')
      }
    }).catch(_ => {
      vm.$message.error('获取现有国家列表失败-catch')
    })
  },
  mounted () {
    let vm = this
    if (vm.view === 2) { // 场景为查看详情
      vm.doEdit = true
      vm.detail = true
      vm.showSubmit = false
      for (let k in vm.init) {
        if (vm.options.hasOwnProperty(k)) {
          vm.options[k] = vm.init[k]
        }
      }
    }
  },
  methods: {
    uninHandle (value, option) {
      let vm = this
      vm.options.permStatus = value
    },
    // 修改
    toEdit () {
      this.showSubmit = true
      this.doEdit = false
      // this.driver.headImage = ''
      // this.driver.driverLicenseImage = ''
    },
    // 提交
    editDriver () {
      let vm = this
      if (this.view === 1) {
        this.$confirm({
          title: '是否为菜单相关权限',
          content: '是菜单权限则该权限会影响到菜单显示，请谨慎选择',
          okText: '是',
          cancelText: '否',
          onOk () {
            vm.addSubmit(1)
          },
          onCancel () {
            vm.addSubmit(0)
          }
        })
      } else if (this.view === 2) {
        this.editSubmit()
      }
    },
    addSubmit (isMenu) {
      let vm = this
      let langArray = []
      for (let k in vm.countryArray) {
        if (vm.countryArray[k].value) {
          langArray.push({'zhCode': vm.cArray.find(item => item.countryCode === vm.countryArray[k].countryCode).code,
            'text': vm.countryArray[k].value.trim()})
        } else {
          vm.$message.error('所有国家对应资源名为必填')
          return false
        }
      }
      let addOpt = {
        international: JSON.stringify(langArray),
        // permUrl: vm.options.permUrl.trim(),
        permStatus: vm.options.permStatus,
        // parentId: vm.options.parentId,
        createUserId: sessionStorage.getItem('sysUserId')
      }
      for (let k in addOpt) {
        if (addOpt[k] === '') {
          vm.$message.error(vm.$i18n.t('addDriver.optionNotFull'))
          return false
        }
      }
      if (isMenu === 1) {
        addOpt['isMenuPerm'] = isMenu
      }
      if (vm.options.permUrl) {
        addOpt['permUrl'] = vm.options.permUrl.trim()
      }
      if (vm.options.parentId) {
        addOpt['parentId'] = vm.options.parentId
      }
      vm.isLoading = true
      postToken(urls.saveOrUpdatePermis, addOpt).then(res => {
        let code = res.data.code
        if (code === '10000') {
          vm.$message.success(vm.$i18n.t('common.success'))
          setTimeout(() => {
            vm.$router.go(0)
          }, 1500)
        } else {
          vm.$message.error(vm.$i18n.t('common.false'))
        }
        vm.isLoading = false
      }).catch(() => {
        vm.$message.error(vm.$i18n.t('common.false'))
        vm.isLoading = false
      })
    },
    editSubmit () {
      let vm = this
      let addOpt = {
        permId: vm.init.permId,
        permUrl: vm.options.permUrl,
        updateUserId: sessionStorage.getItem('sysUserId')
      }
      vm.isLoading = true
      postToken(urls.saveOrUpdatePermis, addOpt).then(res => {
        let code = res.data.code
        if (code === '10000') {
          vm.$message.success(vm.$i18n.t('common.success'))
          setTimeout(() => {
            vm.$router.go(0)
          }, 1500)
        } else {
          vm.$message.error(vm.$i18n.t('common.false'))
        }
        vm.isLoading = false
      }).catch(() => {
        vm.$message.error(vm.$i18n.t('common.false'))
        vm.isLoading = false
      })
    }
  }
}
</script>

<style scoped>
  .buttonList{
    text-align: center;
  }
  img{
    max-width: 100%;
    max-height: 180px;
  }
</style>
