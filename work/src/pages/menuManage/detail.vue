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
        label="菜单url"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.lazy="options.menuUrl" :disabled="detail"></a-input>
      </a-form-item>
      <a-form-item
        label="菜单排序"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input-number v-model.lazy="options.menuOrder" :disabled="detail" :min="1"></a-input-number>
      </a-form-item>
      <a-form-item
        label="父级菜单"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-select
          v-model="options.parentId"
          :disabled="detail"
        >
          <!--          <a-select-option :key="0">屏蔽</a-select-option>-->
          <!--          <a-select-option :key="1">显示</a-select-option>-->
          <a-select-option v-for="k in parent" :key="k.index" :value="k.id">{{k.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="状态"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        v-if="view === 2"
      >
        <a-select
          v-model="options.enable"
          :disabled="detail"
          @change="uninHandle"
        >
          <a-select-option :key="'true'">正常</a-select-option>
          <a-select-option :key="'false'">禁用</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="备注"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-textarea v-model="options.remark" :disabled="detail"></a-textarea>
      </a-form-item>
    </a-form>
    <div class="buttonList">
      <a-button type="primary" v-if="showSubmit" @click="addSubmit" :loading="isLoading" :disabled="isLoading">{{$t('addCountry.submit')}}</a-button>
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
      options: {
        menuName: '',
        menuUrl: '',
        menuIcon: '',
        menuOrder: '',
        enable: '',
        countryCode: '',
        remark: ''
        // ---
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
      let param = {
        menuId: vm.init.menuId
      }
      postToken(urls.getMenu, param).then(res => {
        let code = res.data.code
        if (code === '10000') {
          let response = res.data.data
          vm.options.enable = response.enable ? 'true' : 'false'
          vm.options.menuIcon = response.icon
          vm.options.menuUrl = response.link
          vm.options.menuName = response.name
          vm.options.parentId = response.parentId
          vm.options.remark = response.remark
        } else {
          vm.$message.error('获取菜单详情失败-then')
        }
      }).catch(_ => {
        vm.$message.error('获取菜单详情失败-catch')
      })
    }
  },
  methods: {
    uninHandle (value, option) {
      let vm = this
      vm.options.enable = value
    },
    // 修改
    toEdit () {
      this.showSubmit = true
      this.doEdit = false
      this.detail = false
      // this.driver.headImage = ''
      // this.driver.driverLicenseImage = ''
    },
    // 提交
    editDriver () {
      if (this.view === 1) {
        this.addSubmit()
      } else if (this.view === 2) {
        this.editSubmit()
      }
    },
    addSubmit () {
      let vm = this
      let langArray = []
      let addOpt = {
        // menuName: langArray,
        link: vm.options.menuUrl,
        // menuIcon: '',
        menuOrder: vm.options.menuOrder
        // enable: vm.options.enable
        // parentId: vm.options.parentId,
        // createUser: sessionStorage.getItem('sysUserId'),
        // remark: vm.options.remark
      }
      for (let k in addOpt) {
        if (addOpt[k] === '') {
          vm.$message.error(vm.$i18n.t('addDriver.optionNotFull'))
          return false
        }
      }
      addOpt['menuIcon'] = ''
      addOpt['parentId'] = vm.options.parentId
      addOpt['remark'] = vm.options.remark
      if (vm.view === 1) {
        addOpt['createUser'] = sessionStorage.getItem('sysUserId')
        for (let k in vm.countryArray) {
          if (vm.countryArray[k].value) {
            langArray.push({'zhCode': vm.cArray.find(item => item.countryCode === vm.countryArray[k].countryCode).code,
              'text': vm.countryArray[k].value.trim()})
          } else {
            vm.$message.error('除图标和父级及备注，其他为必填项')
            return false
          }
        }
        addOpt['international'] = JSON.stringify(langArray)
      } else if (vm.view === 2) {
        addOpt['menuId'] = vm.init.menuId
        addOpt['enable'] = vm.init.enable
        addOpt['updateUser'] = sessionStorage.getItem('sysUserId')
      }
      vm.isLoading = true
      postToken(urls.saveOrUpdateMenu, addOpt).then(res => {
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
