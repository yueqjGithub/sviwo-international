<template>
  <div class="menuCont">
    <div class="left">
      <el-tree :data="menuTree"
               node-key="menuId"
               :expand-on-click-node="false"
               :highlight-current="true"
               default-expand-all
      >
        <template slot-scope="{ node, data }">
          <div class="custom-tree-node">
            <span>{{ data.name }}</span>
            <span>
              <a-button
                type="primary"
                size="small"
                v-if="data.children.length === 0 && showSetPerm"
                @click="openPerm(data.menuId,0)"
              >
                配置权限
              </a-button>
              <a-button
                type="primary"
                size="small"
                @click="openDetail(data,2)"
              >
                详情
              </a-button>
              <a-button
                type="danger"
                size="small"
                @click="removeOneMenu(data.menuId)"
              >
                删除
              </a-button>
            </span>
          </div>
        </template>
      </el-tree>
      <div style="margin-top: 5px; text-align: center;">
        <a-button icon="plus" type="primary" @click="openDetail(null,1)">增加菜单</a-button>
      </div>
      <a-drawer
        placement="right"
        :closable="true"
        :maskClosable="false"
        @close="drawerClose"
        :visible="visible"
        :width="drawerWidth"
        :destroyOnClose="true"
      >
        <perm-list v-if="drawerStatus === 0" :permList="permList" :menuId="initId"></perm-list>
<!--        <search-driver @doSearch="search" @subTags="editTags" v-if="drawerStatus === 0" @refresh="fresh"></search-driver>-->
        <detail :init = 'initObject' :parent="parentList" :view="drawerStatus" v-if="drawerStatus === 1 || drawerStatus === 2"></detail>
      </a-drawer>
    </div>
  </div>
</template>

<script>
import urls from '@/config/api'
import { postToken } from '@/config/extendAXIOS'
import detail from '@/pages/menuManage/detail'
import permList from '@/pages/menuManage/setPerm'
export default {
  name: 'menuList',
  components: {
    detail,
    permList
  },
  data () {
    return {
      menuTree: undefined,
      menuItem: '',
      menuMore: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      visible: false, // 是否显示抽屉
      drawerWidth: '40vw',
      drawerStatus: 0, // 0-搜索，1-添加，2-修改,
      parentList: [],
      initObject: undefined,
      permList: [],
      showSetPerm: true,
      initId: ''
    }
  },
  created () {
    let vm = this
    let param = {
      menuId: 0
    }
    postToken(urls.getMenuTree, param).then(res => {
      let code = res.data.code
      if (code === '10000') {
        vm.menuTree = res.data.data
        for (let k in vm.menuTree) {
          vm.parentList.push({name: vm.menuTree[k].name, id: vm.menuTree[k].menuId})
        }
      } else {
        vm.$message.error('获取菜单树失败-then')
      }
    }, _ => {
      vm.$message.error('获取菜单树失败-catch')
    })
    let param1 = {
    }
    postToken(urls.queryPermMenu, param1).then(res => {
      let code = res.data.code
      if (code === '10000') {
        // vm.permList = response
        let response = res.data.data
        vm.permList = response
        vm.showSetPerm = true
      } else {
        vm.$message.error('获取权限列表失败--then')
        vm.showSetPerm = false
      }
    }).catch(_ => {
      vm.$message.error('获取权限列表失败--catch')
      vm.showSetPerm = false
    })
  },
  methods: {
    // 权限配饰
    openPerm (item, type) {
      this.visible = true
      this.drawerWidth = '65vw'
      this.initId = item
      this.drawerStatus = type
    },
    // 添加
    openDetail (item, type) {
      this.visible = true
      this.drawerWidth = '40vw'
      this.initObject = item
      this.drawerStatus = type
    },
    drawerClose () {
      this.visible = false
    },
    // 详情
    checkNode (value) {
      console.log(value)
    },
    removeOneMenu (id) {
      let vm = this
      let params = {
        menuId: id
      }
      vm.$confirm({
        title: 'warning',
        content: '确定要删除此菜单吗',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          postToken(urls.deleteMenu, params).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.success('成功')
              setTimeout(() => {
                vm.$router.go(0)
              }, 1500)
            } else {
              vm.$message.error('失败-then')
            }
          }, _ => {
            vm.$message.error('失败-err')
          })
        },
        onCancel () {
        }
      })
    }
  }
}
</script>

<style scoped>
.menuCont{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.left{
  width: 80%;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
