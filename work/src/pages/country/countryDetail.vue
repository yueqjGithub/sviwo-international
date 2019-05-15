<template>
  <div class="country-detail-cont">
    <a-form>
      <a-form-item>
<!--        基础配置-->
        <h3>{{$t('addCountry.basic')}}</h3>
      </a-form-item>
      <a-form-item
        :label="$t('addCountry.chooseCountry')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-select
          v-model="options.countryName"
          :disabled="disEdit"
          :filterOption="filterCountrySelect"
          showSearch
        >
          <a-select-option v-for="i in countryList" :key="i.en" v-if="lang === 'CN'">{{i.zh}}</a-select-option>
          <a-select-option v-for="i in countryList" :key="i.en" v-if="lang === 'EN'">{{i.en}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('addCountry.unit')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.currencyCode"
                 :disabled="disEdit"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('addCountry.alarmPhone')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.alarmContacts"
                 :disabled="disabled"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('addCountry.symbol')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.currencySymbol"
                 :disabled="true"></a-input>
      </a-form-item>
      <a-form-item>
<!--        行程配置-->
        <h3>{{$t('addCountry.trip')}}</h3>
      </a-form-item>
      <a-form-item
        :label="$t('addCountry.dispatchRange')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input-number :disabled="disabled" :min="0" :step="0.1" v-model="options.tripConfig.dispatchRange"/>
      </a-form-item>
      <a-form-item
        :label="$t('addCountry.drivingRange')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input-number :disabled="disabled" :min="0" :step="0.1" v-model="options.tripConfig.drivingRange"/>
      </a-form-item>
      <a-form-item
        :label="$t('addCountry.baseRange')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input-number :disabled="disabled" :min="0" :step="0.1" v-model="options.tripConfig.baseRange"/>
      </a-form-item>
      <a-form-item
        :label="$t('addCountry.remoteRange')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input-number :disabled="disabled" :min="0" :step="0.1" v-model="options.tripConfig.remoteRange"/>
      </a-form-item>
      <a-form-item>
        <!--        价格配置-->
        <h3>{{$t('addCountry.price')}}</h3>
      </a-form-item>
      <a-form-item
        :label="$t('addCountry.baseFare')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input-number :min="0" :step="0.01" v-model="options.rateConfig.baseFare" :disabled="disabled"/>
      </a-form-item>
      <a-form-item
        :label="$t('addCountry.timeFare')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input-number :min="0" :step="0.01" v-model="options.rateConfig.timeFare" :disabled="disabled"/>
      </a-form-item>
      <a-form-item
        :label="$t('addCountry.remoteFare')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input-number :min="0" :step="0.01" v-model="options.rateConfig.remoteFare" :disabled="disabled"/>
      </a-form-item>
      <a-form-item
        :label="$t('addCountry.milesFare')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input-number :min="0" :step="0.01" v-model="options.rateConfig.milesFare" :disabled="disabled"/>
      </a-form-item>
      <a-form-item>
        <div style="text-align: center">
          <a-button type="primary" :disabled="disabled" @click.prevent="submitCountry" v-if="showSub">{{$t('addCountry.submit')}}</a-button>
          <a-button type="primary" v-if="showEdit" @click="doEdit">{{$t('addCountry.edit')}}</a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import cList from '@/config/countryList'
import urls from '@/config/api'
import {postToken} from '@/config/extendAXIOS'

export default {
  name: 'countryDetail',
  props: ['type', 'obj'],
  mounted () {
    let vm = this
    // let countryCode = sessionStorage.getItem('countryCode')
    if (vm.type === 1) { // 1 - 查看时
      vm.showSub = false
      vm.disabled = true
      vm.disEdit = true
      // if (countryCode === null || countryCode === '') {
      //   vm.showEdit = true
      // }
      vm.showEdit = true
      // 赋值
      vm.options.countryName = vm.obj.countryName
      vm.options.currencyCode = vm.obj.currencyCode
      vm.options.alarmContacts = vm.obj.alarmContacts
      // vm.options.currencySymbol = vm.obj.currencySymbol
      vm.options.tripConfig.dispatchRange = vm.obj.dispatchRange
      vm.options.tripConfig.drivingRange = vm.obj.drivingRange
      vm.options.tripConfig.baseRange = vm.obj.baseRange
      vm.options.tripConfig.remoteRange = vm.obj.remoteRange
      vm.options.rateConfig.baseFare = vm.obj.baseFare
      vm.options.rateConfig.milesFare = vm.obj.milesFare
      vm.options.rateConfig.timeFare = vm.obj.timeFare
      vm.options.rateConfig.remoteFare = vm.obj.remoteFare
    }
  },
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
      countryList: cList2(),
      disabled: false,
      disEdit: false, // 不可修改的input状态
      lang: lang,
      showSub: true,
      showEdit: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      options: {
        countryName: '',
        currencyCode: '',
        alarmContacts: '',
        currencySymbol: '$',
        tripConfig: {
          dispatchRange: 0,
          drivingRange: 0,
          baseRange: 0,
          remoteRange: 0
        },
        rateConfig: {
          baseFare: 0,
          milesFare: 0,
          timeFare: 0,
          remoteFare: 0
        }
      }
    }
  },
  methods: {
    doEdit () {
      this.showSub = true
      this.disabled = false
      this.showEdit = false
    },
    submitCountry () {
      let vm = this
      for (let k in vm.options) { // 非空判断
        if (vm.options[k] === '') {
          vm.$message.error(vm.$i18n.t('addCountry.needOptions'))
          return false
        }
      }
      for (let k in vm.options.tripConfig) {
        if (vm.options.tripConfig[k] === '' || vm.options.tripConfig[k] === undefined) {
          vm.$message.error(vm.$i18n.t('addCountry.needOptions'))
          return false
        }
      }
      for (let k in vm.options.rateConfig) {
        if (vm.options.rateConfig[k] === '' || vm.options.rateConfig[k] === undefined) {
          vm.$message.error(vm.$i18n.t('addCountry.needOptions'))
          return false
        }
      }
      // 拼装行程配置和运价配置
      let trip = JSON.stringify(vm.options.tripConfig)
      let rate = JSON.stringify(vm.options.rateConfig)
      let opt = vm.options
      opt.tripConfig = trip
      opt.rateConfig = rate
      let countryCode = ''

      countryCode = vm.countryList.find(item => item.en === vm.options.countryName).locale
      opt.countryCode = countryCode
      // 修改和添加差异--id
      if (vm.type === 1) {
        opt.countryId = vm.obj.countryId
      }
      // 拼装操作人
      let userId = sessionStorage.getItem('sysUserId')
      opt.createUser = userId
      vm.$confirm({
        title: vm.$i18n.t('addCountry.confirmTit'),
        content: '',
        okText: vm.$i18n.t('common.ok'),
        cancelText: vm.$i18n.t('common.cancel'),
        onOk () {
          postToken(urls.saveOrUpdateCountry, opt).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.success(vm.$i18n.t('common.success'))
              setTimeout(() => {
                vm.$router.go(0)
              }, 1500)
            } else if (code === '10002') {
              vm.$message.error(vm.$i18n.t('countryList.doubleCreate'))
            } else {
              vm.$message.error(vm.$i18n.t('common.false'))
            }
            vm.options.tripConfig = JSON.parse(trip)
            vm.options.rateConfig = JSON.parse(rate)
          }).catch(
            () => {
              vm.$message.error(vm.$i18n.t('common.false'))
              vm.options.tripConfig = JSON.parse(trip)
              vm.options.rateConfig = JSON.parse(rate)
            }
          )
        }
      })
    }
  }
}
</script>

<style scoped>
.country-detail-cont{
  width: 100%;
}
</style>
