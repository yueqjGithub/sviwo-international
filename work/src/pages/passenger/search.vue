<template>
  <div>
    <a-form>
      <a-form-item
        :label="$t('passengerList.pasId')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.passengerId"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('passengerList.tel')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.mobileNumber"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('passengerList.firstName')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.firstName"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('passengerList.lastName')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.lastName"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('passengerList.passengerSex')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-select
          v-model="options.passengerSex"
        >
          <a-select-option :key="0">female</a-select-option>
          <a-select-option :key="1">male</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :label="$t('passengerList.countryName')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-select
          v-model="options.countryCode"
          :filterOption="filterCountrySelect"
          showSearch
        >
          <a-select-option v-for="i in countryList" :key="i.locale" v-if="lang === 'zh-CN'">{{i.zh}}</a-select-option>
          <a-select-option v-for="i in countryList" :key="i.locale" v-if="lang === 'en-US'">{{i.en}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('passengerList.birthday')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-date-picker @change="birthChange" placeholder="pick date"/>
      </a-form-item>
      <a-form-item
        :label="$t('passengerList.createTime')"
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
        :label="$t('passengerList.loginTime')"
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
        passengerId: '',
        mobileNumber: '',
        firstName: '',
        lastName: '',
        countryCode: '',
        passengerSex: '',
        birthday: '',
        createTimeStart: '',
        loginTimeStart: ''
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
      if (vm.options['passengerSex'] !== '' && vm.options['passengerSex'] !== null) {
        let trueStatus
        switch (vm.options['passengerSex']) {
          case 0:
            trueStatus = 'female'
            break
          case 1:
            trueStatus = 'male'
            break
        }
        tags['passengerSex'] = trueStatus
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
