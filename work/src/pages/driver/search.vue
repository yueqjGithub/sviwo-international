<template>
  <div>
    <a-form>
      <a-form-item
        :label="$t('driverList.driverId')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.passengerId"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('driverList.firstName')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.firstName"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('driverList.lastName')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.lastName"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('driverList.countryName')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-select
          v-model="options.countryCode"
          :filterOption="filterCountrySelect"
          showSearch
        >
          <a-select-option v-for="i in countryList" :key="i.locale" v-if="lang === 'CN'">{{i.zh}}</a-select-option>
          <a-select-option v-for="i in countryList" :key="i.locale" v-if="lang === 'EN'">{{i.en}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('driverList.mobileNumber')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.mobileNumber"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('driverList.driverSex')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-select
          v-model="options.driverSex"
        >
          <a-select-option :key="0">female</a-select-option>
          <a-select-option :key="1">male</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('driverList.driverBirthday')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-date-picker @change="birthChange" placeholder="pick date"/>
      </a-form-item>
      <a-form-item
        :label="$t('driverList.createTime')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <el-date-picker
          v-model="options.createTimeStart"
          type="date"
          size="mini"
        >
        </el-date-picker>
      </a-form-item>
      <a-form-item
        :label="$t('driverList.loginTime')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <el-date-picker
          v-model="options.loginTimeStart"
          type="date"
          size="mini"
        >
        </el-date-picker>
      </a-form-item>
      <a-form-item
        :label="$t('driverList.certificateNo')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.certificateNo"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('driverList.vehicleNumber')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.vehicleNumber"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('driverList.drivingCountry')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-select
          v-model="options.drivingCountry"
        >
          <a-select-option v-for="i in countryList" :key="i.en" v-if="lang === 'zh-CN'">{{i.zh}}</a-select-option>
          <a-select-option v-for="i in countryList" :key="i.en" v-if="lang === 'en-US'">{{i.en}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <div style="text-align: center">
          <a-button type="primary" icon="search" @click="search">{{$t('common.Search')}}</a-button>
          <a-button type="primary" icon="reload" @click="refresh">{{$t('common.Reset')}}</a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import cList from '@/config/countryList'
export default {
  name: 'searchPas',
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
      lang: lang,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      },
      options: {
        driverId: '',
        firstName: '',
        lastName: '',
        countryCode: '',
        mobileNumber: '',
        driverSex: '',
        driverBirthday: '',
        loginTimeStart: '',
        createTimeStart: '',
        certificateNo: '',
        vehicleNumber: '',
        drivingCountry: ''
      }
    }
  },
  methods: {
    birthChange (data, dataString) {
      this.options.birthday = new Date(dataString).getTime()
    },
    search () {
      let vm = this
      let data = {}
      let tags = {}
      for (let k in vm.options) {
        if (vm.options[k] !== '') {
          data[k] = vm.options[k]
          tags[k] = vm.options[k]
        }
      }
      if (vm.options.createTimeStart !== '') {
        data.createTimeStart = vm.eleTimeExchange(vm.options.createTimeStart)
      }
      if (vm.options.loginTimeStart !== '') {
        data.loginTimeStart = vm.eleTimeExchange(vm.options.loginTimeStart)
      }
      let opt = {
        cur: 1,
        data: data
      }
      vm.$emit('doSearch', opt)
      if (vm.options['driverSex'] !== '' && vm.options['driverSex'] !== null) {
        let trueStatus
        switch (vm.options['driverSex']) {
          case 0:
            trueStatus = 'female'
            break
          case 1:
            trueStatus = 'male'
            break
        }
        tags['driverSex'] = trueStatus
      }
      vm.$emit('subTags', tags)
    },
    refresh () {
      let vm = this
      for (let k in vm.options) {
        vm.options[k] = ''
      }
      vm.$emit('refresh')
    }
  }
}
</script>

<style scoped>

</style>
