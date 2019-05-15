<template>
  <div>
    <a-form>
      <a-form-item
        label="资源ID"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.permId"></a-input>
      </a-form-item>
      <a-form-item
        label="资源状态"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-select
          v-model="options.permStatus"
        >
          <a-select-option :key="0">屏蔽</a-select-option>
          <a-select-option :key="1">正常</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="权限名称"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.permName"></a-input>
      </a-form-item>
      <a-form-item
        label="创建人"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.createUser"></a-input>
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
  name: 'search',
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
        permId: '',
        permName: '',
        permStatus: undefined,
        createUser: ''
      }
    }
  },
  methods: {
    search () {
      let vm = this
      let data = {}
      for (let k in vm.options) {
        if (vm.options[k] !== '' && vm.options[k] !== undefined) {
          data[k] = vm.options[k]
        }
      }
      let opt = {
        cur: 1,
        data: data
      }
      vm.$emit('doSearch', opt)
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
