<template>
  <div>
    <a-form>
      <a-form-item
        label="类型名称"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.typeName"></a-input>
      </a-form-item>
      <a-form-item
        label="类型编码"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.code"></a-input>
      </a-form-item>
      <a-form-item
        label="备注"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.remark"></a-input>
      </a-form-item>
      <a-form-item
        :style="{textAlign: 'center'}"
      >
        <a-button @click="saveCreate" type="primary" :loading="saving" :disabled="saving" :style="{marginRight: '4px'}">保存</a-button>
        <a-button @click="cancelCreate" type="primary" :loading="saving" :disabled="saving">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { postToken } from '@/config/extendAXIOS'
import urls from '@/config/api'
export default {
  name: 'detail',
  data () {
    return {
      saving: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      },
      options: {
        code: '',
        remark: '',
        typeName: ''
      }
    }
  },
  methods: {
    saveCreate () {
      let vm = this
      let param = {
        code: vm.code,
        remark: vm.remark,
        typeName: vm.typeName
      }
      if (vm.code === '') {
        vm.$message.error('类型编码不能为空')
        return false
      }
      if (vm.typeName === '') {
        vm.$message.error('类型名称不能为空')
        return false
      }
      this.saving = true
      this.$confirm({
        title: '确认要保存吗？',
        content: '该操作会影响APP用户相关操作，请谨慎操作',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          postToken(urls.addOrUpdateDicType, param).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.success('操作成功')
              vm.$emit('refresh')
            } else {
              vm.$message.error('操作失败-then')
            }
            vm.saving = false
          }).catch(_ => {
            vm.$message.error('操作失败-catch')
            vm.saving = false
          })
        },
        onCancel () {
          vm.saving = false
        }
      })
    },
    cancelCreate () {
      this.$emit('off')
    }
  }
}
</script>

<style scoped>

</style>
