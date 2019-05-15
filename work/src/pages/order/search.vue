<template>
  <div>
    <a-form>
      <a-form-item
        :label="$t('orderList.orderId')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.orderId"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('orderList.countryName')"
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
        :label="$t('orderList.orderType')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-select v-model="options.orderType">
          <a-select-option v-for="k in typeList" :key="k.key">{{k.value}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('orderList.orderStatus')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :help="$t('orderList.mustChoose')"
      >
        <a-select v-model="options.orderStatus">
          <a-select-option v-for="k in statusList[options.orderType]" :key="k.key">{{k.value}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('orderList.dmobileNumber')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.dmobileNumber"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('orderList.pmobileNumber')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.pmobileNumber"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('orderList.startTime')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <el-date-picker
          v-model="options.createTime"
          type="datetime"
        >
        </el-date-picker>
      </a-form-item>
      <a-form-item
        :label="$t('orderList.endTime')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <el-date-picker
          v-model="options.endTime"
          type="datetime"
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
    const typeList = [{value: this.$i18n.t('orderList.Dispatch'), key: 'Dispatch'},
      {value: this.$i18n.t('orderList.Charge'), key: 'Charge'}
    ]
    const statusList = {
      'Dispatch': [{value: this.$i18n.t('orderList.dispatch1'), key: 1}, {value: this.$i18n.t('orderList.dispatch2'), key: 2},
        {value: this.$i18n.t('orderList.dispatch3'), key: 3},
        {value: this.$i18n.t('orderList.dispatch4'), key: 4},
        {value: this.$i18n.t('orderList.dispatch5'), key: 5},
        {value: this.$i18n.t('orderList.dispatch6'), key: 6},
        {value: this.$i18n.t('orderList.dispatch7'), key: 7},
        {value: this.$i18n.t('orderList.dispatch8'), key: 8},
        {value: this.$i18n.t('orderList.dispatch9'), key: 9}
      ],
      'Charge': [{value: this.$i18n.t('orderList.charge0'), key: 0},
        {value: this.$i18n.t('orderList.charge1'), key: 1}]
    }
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
      typeList,
      statusList,
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
        orderId: '',
        countryCode: '',
        orderStatus: '',
        pmobileNumber: '',
        dmobileNumber: '',
        orderType: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  methods: {
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
      if (vm.options.startTime !== '') {
        data.startTime = vm.eleTimeExchange(vm.options.startTime)
      }
      if (vm.options.endTime !== '') {
        data.endTime = vm.eleTimeExchange(vm.options.endTime)
      }
      let opt = {
        cur: 1,
        data: data
      }
      vm.$emit('doSearch', opt)
      if (vm.options['orderType']) {
        tags['orderType'] = vm.typeList.find(item => item.key === vm.options['orderType']).value
      }
      if (vm.options['orderStatus']) {
        tags['orderStatus'] = vm.statusList[vm.options.orderType].find(item => item.key === vm.options['orderStatus']).value
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
