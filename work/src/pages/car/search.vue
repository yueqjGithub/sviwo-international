<template>
  <div>
    <a-form>
      <a-form-item
        :label="$t('carList.vehicleNumber')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.vehicleNumber"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('carList.carStatus')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-select
          v-model="options.carStatus"
        >
          <a-select-option :key="0">{{$t('carList.undistributed')}}</a-select-option>
          <a-select-option :key="1">{{$t('carList.allocated')}}</a-select-option>
          <a-select-option :key="2">{{$t('carList.offline')}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('carList.licensePlates')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.licensePlates"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('carList.countryName')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-select
          v-model="options.countryName"
          :filterOption="filterCountrySelect"
          showSearch
        >
          <a-select-option v-for="i in countryList" :key="i.en" v-if="lang === 'CN'">{{i.zh}}</a-select-option>
          <a-select-option v-for="i in countryList" :key="i.en" v-if="lang === 'EN'">{{i.en}}</a-select-option>
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
  name: 'searchCar',
  data () {
    const lang = localStorage.getItem('lang')
    return {
      countryList: cList,
      lang: lang,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      options: {
        vehicleNumber: '',
        carStatus: '',
        licensePlates: '',
        countryName: ''
      }
    }
  },
  methods: {
    search () {
      let vm = this
      let data = {}
      let tags = {}
      for (let k in vm.options) {
        if (vm.options[k] !== '' && vm.options[k] !== undefined) {
          data[k] = vm.options[k]
          tags[k] = vm.options[k]
        }
      }
      let opt = {
        cur: 1,
        data: data
      }
      vm.$emit('doSearch', opt)
      if (tags['carStatus']) {
        let trueStatus
        switch (tags['carStatus']) {
          case 0:
            trueStatus = vm.$i18n.t('carList.undistributed')
            break
          case 1:
            trueStatus = vm.$i18n.t('carList.allocated')
            break
          case 2:
            trueStatus = vm.$i18n.t('carList.offline')
            break
        }
        tags['carStatus'] = trueStatus
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
