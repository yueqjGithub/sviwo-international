<template>
  <div>
    <a-input
      placeholder="search"
      v-model="filterText">
    </a-input>
    <el-tree
      :data="source"
      :props="props"
      show-checkbox
      node-key="permId"
      :check-strictly="false"
      :default-expanded-keys="defaultExpand"
      :default-checked-keys="rolePerm"
      :filter-node-method="filterNode"
      @check-change="handleCheckChange"
      ref="tree2"
    >
    </el-tree>
    <div style="text-align: center;">
      <a-button type="primary" @click="doSubmit">{{$t('roleList.submit')}}</a-button>
    </div>
  </div>
</template>

<script>
import { postToken } from '@/config/extendAXIOS'
import urls from '@/config/api'
export default {
  name: 'setPerm',
  props: ['roleId'],
  data () {
    return {
      filterText: '',
      source: [], // 整树
      rolePerm: [], // 角色拥有的权限permId集
      defaultExpand: [],
      props: {
        label: 'permName',
        children: 'children'
      }
    }
  },
  created () {
    let vm = this
    let params = {
    }
    postToken(urls.permRoleConfig, params).then(res => {
      let code = res.data.code
      if (code === '10000') {
        vm.source = res.data.data
        for (let k in res.data.data) {
          vm.defaultExpand.push(res.data.data[k].permId)
        }
      } else {
        vm.$message.error(vm.$i18n.t('roleList.getAllPermFalse'))
      }
    }, _ => {
      vm.$message.error(vm.$i18n.t('roleList.getAllPermFalse'))
    })
  },
  mounted () {
    let vm = this
    let param = {
      roleId: vm.roleId
    }
    postToken(urls.findPermisIdByRoleId, param).then(res => {
      let code = res.data.code
      if (code === '10000') {
        let list = res.data.data
        for (let k in list) {
          vm.rolePerm.push(list[k].permissionId)
        }
      } else {
        vm.$message.error(vm.$i18n.t('roleList.getUserPermFalse'))
      }
    }).catch(_ => {
      vm.$message.error(vm.$i18n.t('roleList.getUserPermFalse'))
    })
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.permName.indexOf(value) !== -1
    },
    handleCheckChange (data, checked, indeterminate) {
      let vm = this
      if (data.children.length === 0) {
        if (checked === true) {
          vm.rolePerm.push(data.permId)
        } else if (checked === false) {
          let num = vm.rolePerm.indexOf(data.permId)
          if (num !== -1) {
            vm.rolePerm.splice(num, 1)
          }
        }
      }
    },
    doSubmit () {
      let vm = this
      vm.$confirm({
        okText: vm.$i18n.t('common.ok'),
        cancelText: vm.$i18n.t('common.cancel'),
        title: vm.$i18n.t('common.warning'),
        content: vm.$i18n.t('audit.toastInfo'),
        onOk () {
          let params = {
            roleId: vm.roleId,
            permissionId: vm.rolePerm.join(',')
          }
          postToken(urls.saveRolePermission, params).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.success(vm.$i18n.t('common.success'))
              vm.$emit('close')
            } else {
              vm.$message.error(vm.$i18n.t('common.false'))
            }
          }).catch(_ => {
            vm.$message.error(vm.$i18n.t('common.false'))
          })
        }
      })
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val)
    }
  }
}
</script>

<style scoped>

</style>
