<template>
  <div>
    <div class="btnGroup">
      <a-button type="primary" icon="plus" @click="openDetail(null,1)">{{$t('common.Add')}}</a-button>
      <a-button type="primary" icon="search" class="group-btn" @click="openSearch">高级搜索</a-button>
    </div>
    <!--      表格-->
    <a-spin :spinning="spinning">
      <el-table
        :data="data"
        height="68vmin"
      >
        <el-table-column
          label="资源名称"
          prop="permName"
        >
          <template slot-scope="scope" slot="header">
            <a-input-search
              placeholder="资源名称"
              style="width: 150px"
              @search="nameSearch"
              v-model="clearInput.clearOne"
            />
            <a-button shape="circle" size="small" icon="reload" @click="reload"></a-button>
          </template>
          <template slot-scope="scope">
            <a href="javascript:;" @click.prevent="openDetail(scope.row,2)">{{scope.row.permName}}</a>
          </template>
        </el-table-column>
        <el-table-column
          label="资源路径"
          prop="permUrl"
        >
          <template slot-scope="scope" slot="header">
            <a-input-search
              placeholder="资源路径"
              style="width: 150px"
              @search="urlSearch"
              v-model="clearInput.clearTwo"
            />
            <a-button shape="circle" size="small" icon="reload" @click="reload"></a-button>
          </template>
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="createUser"
        >
          <template slot-scope="scope" slot="header">
            <a-input-search
              placeholder="创建人"
              style="width: 150px"
              @search="createSearch"
              v-model="clearInput.clearTrd"
            />
            <a-button shape="circle" size="small" icon="reload" @click="reload"></a-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <a-button type="danger" @click="deleteHandle(scope.row)" size="small">删除</a-button>
          </template>
        </el-table-column>
      </el-table>
    </a-spin>
    <a-drawer
      placement="right"
      :closable="true"
      :maskClosable="false"
      :title=drawerTitle
      @close="drawerClose"
      :visible="visible"
      :width="drawerWidth"
      :destroyOnClose="true"
    >
      <search @doSearch="search" v-if="drawerStatus === 0" @refresh="fresh"></search>
      <detail :init = 'initObject' :parent="parentList" :view="drawerStatus" v-if="drawerStatus === 1 || drawerStatus === 2"></detail>
    </a-drawer>
  </div>
</template>

<script>
import { postToken } from '@/config/extendAXIOS'
import urls from '@/config/api'
import search from '@/pages/permission/search'
import detail from '@/pages/permission/detail'
export default {
  name: 'permList',
  components: {
    search,
    detail
  },
  data () {
    return {
      initObject: {},
      spinning: false,
      data: [],
      oldData: [], // 存放原list
      searchOptions: {}, // 存放搜索参数
      showTags: {}, // 存放搜索Tags显示
      isSearch: false, // 是否在搜索状态中
      cur: 1,
      total: 1,
      pageSize: 20,
      visible: false, // 是否显示抽屉
      drawerStatus: 0, // 0-搜索，1-添加，2-修改
      drawerWidth: '40vw',
      clearInput: {
        clearOne: '',
        clearTwo: '',
        clearTrd: ''
      },
      parentList: []
    }
  },
  created () {
    let param = {
      pageSize: 500,
      currentPage: 1
    }
    this.getOnePage(urls.getPermission, param)
  },
  methods: {
    // 删除权限
    deleteHandle (perm) {
      let vm = this
      let param = {
        permissionId: perm.permId
      }
      vm.$confirm({
        title: 'warning',
        content: '确定要删除吗',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          postToken(urls.deletePermission, param).then(res => {
            if (res.data.code === '10000') {
              vm.$message.success('成功')
              let num = vm.data.indexOf(perm)
              vm.data.splice(num, 1)
            } else {
              vm.$message.error('删除失败--then')
            }
          }).catch(_ => {
            vm.$message.error('删除失败---catch')
          })
        },
        onCancel () {
        }
      })
    },
    // 重置搜索
    fresh () {
      this.searchOptions = {}
      let param = {
        pageSize: 500,
        currentPage: 1
      }
      this.getOnePage(urls.getPermission, param)
    },
    // 搜索
    search (opt) {
      let vm = this
      vm.searchOptions = opt.data
      let param = {
        currentPage: opt.cur,
        pageSize: 500,
        ...vm.searchOptions
      }
      vm.getOnePage(urls.getPermission, param)
    },
    // 关闭抽屉
    drawerClose () {
      this.visible = false
    },
    // 打开搜索
    openSearch () {
      this.visible = true
      this.drawerStatus = 0
      this.drawerWidth = '40vw'
    },
    // 重置
    reload () {
      this.data = this.oldData
      this.clearInput.clearOne = ''
      this.clearInput.clearTwo = ''
    },
    // 创建人搜索
    createSearch (value) {
      let vm = this
      this.spinning = true
      vm.data = vm.oldData
      let list = [...vm.data]
      let newList = []
      list.forEach((item, index) => {
        if (item.createUser.indexOf(value) !== -1) {
          newList.push(item)
        }
      })
      vm.data = newList
      vm.spinning = false
    },
    // 名称搜索
    nameSearch (value) {
      let vm = this
      this.spinning = true
      vm.data = vm.oldData
      let list = [...vm.data]
      let newList = []
      list.forEach((item, index) => {
        if (item.permName.indexOf(value) !== -1) {
          newList.push(item)
        }
      })
      vm.data = newList
      vm.spinning = false
    },
    // 路径搜索
    urlSearch (value) {
      let vm = this
      this.spinning = true
      vm.data = vm.oldData
      let list = [...vm.data]
      let newList = []
      list.forEach((item, index) => {
        if (item.permUrl.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
          newList.push(item)
        }
      })
      vm.data = newList
      vm.spinning = false
    },
    // 打开详情面板
    openDetail (item, type) {
      this.visible = true
      this.drawerWidth = '45vw'
      this.initObject = item
      this.drawerStatus = type
    },
    // turnPage (page, pageSize) {
    //   let vm = this
    //   vm.cur = page
    //   let param = {
    //     pageSize: vm.pageSize,
    //     currentPage: vm.cur,
    //     ...vm.searchOptions
    //   }
    //   vm.getOnePage(urls.getPermission, param)
    // },
    getOnePage (url, params) {
      let vm = this
      this.spinning = true
      postToken(url, params).then(res => {
        let code = res.data.code
        let response = res.data.data
        if (code === '10000') {
          vm.data = []
          for (let k in response) {
            vm.parentList.push({permId: response[k].permId, permName: response[k].permName})
            vm.data.push(...response[k].children)
          }
          vm.oldData = vm.data
        } else {
          vm.$message.error(vm.$i18n.t('common.getDataFalse'))
        }
        this.spinning = false
      }).catch(() => {
        vm.$message.error(vm.$i18n.t('common.getDataError'))
      })
    }
  },
  computed: {
    drawerTitle () {
      let tit
      switch (this.drawerStatus) {
        case 0:
          tit = '高级搜索'
          break
        case 1:
          tit = '添加'
          break
        case 2:
          tit = '详情'
          break
      }
      return tit
    }
  }
}
</script>

<style scoped>

</style>
