<template>
  <div>
    <a-form>
      <a-form-item
        :label="$t('roleList.roleName')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.roleName"></a-input>
      </a-form-item>
<!--      <a-form-item-->
<!--        :label="$t('roleList.countryName')"-->
<!--        :label-col="labelCol"-->
<!--        :wrapper-col="wrapperCol"-->
<!--      >-->
<!--        <a-select-->
<!--          v-model="options.countryCode"-->
<!--        >-->
<!--          <a-select-option v-for="i in countryList" :key="i.locale" v-if="lang === 'zh-CN'">{{i.zh}}</a-select-option>-->
<!--          <a-select-option v-for="i in countryList" :key="i.locale" v-if="lang === 'en-US'">{{i.en}}</a-select-option>-->
<!--        </a-select>-->
<!--      </a-form-item>-->
      <a-form-item
        :label="$t('roleList.createRealName')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.createRealName"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('roleList.createTimeStart')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <el-date-picker
          v-model="options.createTimeStart"
          type="datetime"
          size="mini"
        >
        </el-date-picker>
      </a-form-item>
      <a-form-item
        :label="$t('roleList.createTimeEnd')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <el-date-picker
          v-model="options.createTimeEnd"
          type="datetime"
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
        roleName: '',
        countryCode: '',
        createRealName: '',
        createTimeStart: '',
        createTimeEnd: ''
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
      if (vm.options.createTimeStart !== '') {
        data.createTimeStart = vm.eleTimeExchange(vm.options.createTimeStart)
        tags.createTimeStart = vm.eleTimeExchange(vm.options.createTimeStart)
      }
      if (vm.options.createTimeEnd !== '') {
        data.createTimeEnd = vm.eleTimeExchange(vm.options.createTimeEnd)
        tags.createTimeEnd = vm.eleTimeExchange(vm.options.createTimeEnd)
      }
      let opt = {
        cur: 1,
        data: data
      }
      vm.$emit('doSearch', opt)
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
