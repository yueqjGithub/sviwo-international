<template>
  <div class="detail2">
    <div class="permCont">
      <el-table
        :data="permArr"
        width="100%"
        height="78vmin"
        size="small"
      >
        <el-table-column width="80">
          <template slot-scope="scope">
            <el-radio
              :label="scope.row.permId"
              v-model="checkArr"
              :disabled="scope.row.permMenu === 2"
            >&nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          label="权限名"
          prop="permName">
        </el-table-column>
        <el-table-column
          label="权限路径"
          prop="permUrl"
          sortable
        >
        </el-table-column>
      </el-table>
    </div>
    <div class="permBtn">
      <a-button type="primary" @click="sub" :loading="isLoading" :disabled="isLoading">提交</a-button>
    </div>
  </div>
</template>

<script>
import urls from '@/config/api'
import { postToken } from '@/config/extendAXIOS'

export default {
  name: 'menuPermTree',
  props: ['permList', 'menuId'],
  data: function () {
    return {
      id: '',
      permArr: [],
      checkArr: null,
      isLoading: false
    }
  },
  mounted: function () {
    let vm = this
    this.permArr = this.permList
    this.id = this.menuId
    postToken(urls.findPermIdByMenuId, {menuId: this.id}).then(res => {
      let code = res.data.code
      if (code === '10000') {
        vm.checkArr = res.data.data.permId
      } else {
        vm.$message.error('获取已有资源出错-then')
      }
    }).catch(_ => {
      vm.$message.error('获取已有资源出错-catch')
    })
  },
  methods: {
    sub: function () {
      let vm = this
      let params = {
        menuId: vm.id,
        permissionId: vm.checkArr
      }
      vm.$confirm({
        title: '确定要保存吗',
        content: '请谨慎选择',
        okText: '是',
        cancelText: '否',
        onOk () {
          vm.isLoading = true
          postToken(urls.menuBindingPerm, params).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.success('绑定成功')
              setTimeout(_ => {
                vm.$router.go(0)
              }, 1500)
            } else {
              vm.$message.error('绑定出错--then')
            }
            vm.isLoading = false
          }).catch(_ => {
            vm.$message.error('绑定出错--catch')
            vm.isLoading = false
          })
        },
        onCancel () {
          vm.$message.info('已取消')
        }
      })
    }
  }
}
</script>

<style scoped>
  .permCont{
    padding: 5px;
  }
  .permBtn{
    margin-top: 7px;
  }
</style>
