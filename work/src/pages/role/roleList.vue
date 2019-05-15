<template>
  <div>
    <div class="btnGroup">
      <a-button type="primary" icon="plus" @click="openDetail(null,1)">{{$t('common.Add')}}</a-button>
      <a-button type="primary" icon="search" class="group-btn" @click="openSearch">{{$t('common.Search')}}</a-button>
    </div>
    <!--      中间部分-->
    <div class="middleMode">
      <div style="margin-left: 8px;">
        <div>
          {{$t('common.searchTit')}}:
          <span v-html="showSearchTags"></span>
        </div>
      </div>
      <div class="pageGroup">
        <template>
          <a-pagination :defaultCurrent="cur" :total="total*pageSize" simple :pageSize="pageSize" @change="turnPage" showQuickJumper/>
        </template>
      </div>
    </div>
    <!--      表格-->
    <a-spin :spinning="spinning">
      <el-table
        :data="data"
        height="68vmin"
      >
        <el-table-column
          :label="$t('roleList.roleName')"
          prop="roleName"
          fixed="left"
        >
          <template slot-scope="scope">
            <a href="javascript:;" @click.prevent="openDetail(scope.row,2)">{{scope.row.roleName}}</a>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('roleList.countryName')"
          prop="countryName"
        >
        </el-table-column>
        <el-table-column
          :label="$t('roleList.createRealName')"
          prop="createUserName"
        >
        </el-table-column>
        <el-table-column
          :label="$t('roleList.createTime')"
          prop="createTime"
        >
        </el-table-column>
        <el-table-column
          :label="$t('roleList.updateTime')"
          prop="updateTime"
        >
        </el-table-column>
        <el-table-column
          :label="$t('common.Action')"
          fixed="right"
          width="300"
        >
          <template slot-scope="scope">
            <a-button type="primary" size="small" @click="openPerm(scope.row.roleId)">{{$t('roleList.setPerm')}}</a-button>
            <a-button size="small" type="primary" v-if="scope.row.isDelete === 0" @click="throwCountry(scope.row)">{{$t('countryList.Thraw')}}</a-button>
            <a-button size="small" type="primary" v-if="scope.row.isDelete === 1" @click="freezeCountry(scope.row)">{{$t('countryList.freeze')}}</a-button>
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
      <search @doSearch="search" @subTags="editTags" v-if="drawerStatus === 0" @refresh="fresh"></search>
      <detail :init = 'initObject' :view="drawerStatus" v-if="drawerStatus === 1 || drawerStatus === 2"></detail>
      <setPerm :roleId = 'setUid' v-if="drawerStatus === 3" @close="drawerClose"></setPerm>
    </a-drawer>
  </div>
</template>

<script>
import urls from '@/config/api'
import { postToken } from '@/config/extendAXIOS'
import search from '@/pages/role/search'
import detail from '@/pages/role/detail'
import setPerm from '@/pages/role/setPerm'
export default {
  name: 'roleList',
  components: {
    search,
    detail,
    setPerm
  },
  data () {
    return {
      setUid: '', // 设置权限时的用户id
      initObject: {},
      spinning: false,
      data: [],
      searchOptions: {}, // 存放搜索参数
      showTags: {}, // 存放搜索Tags显示
      isSearch: false, // 是否在搜索状态中
      cur: 1,
      total: 1,
      pageSize: 20,
      visible: false, // 是否显示抽屉
      drawerStatus: 0, // 0-搜索，1-添加，2-修改
      drawerWidth: '40vw'
    }
  },
  created () {
    // let sysUserId = sessionStorage.getItem('sysUserId')
    let countryCode = sessionStorage.getItem('countryCode')
    if (countryCode === '' || countryCode === undefined) {
      countryCode = 'ALL'
    }
    let params = {
      pageSize: 20, // 每页多少条数据
      currentPage: 1, // 第几页
      countryCode: countryCode
    }
    this.getOnePage(urls.getRole, params)
  },
  methods: {
    // 解冻
    throwCountry (item) {
      let vm = this
      let params = {
        roleId: item.roleId
      }
      vm.$confirm({
        title: 'warning',
        content: vm.$i18n.t('countryList.confirmThrow'),
        okText: vm.$i18n.t('common.ok'),
        cancelText: vm.$i18n.t('common.cancel'),
        onOk () {
          postToken(urls.unFreezeRole, params).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.success(vm.$i18n.t('countryList.throwSuccess'))
              item.isDelete = 1
            } else {
              vm.$message.error(vm.$i18n.t('countryList.throwFalse'))
            }
          }, () => {
            vm.$message.error(vm.$i18n.t('countryList.throwFalse'))
          })
        },
        onCancel () {
        }
      })
    },
    // 冻结
    freezeCountry (item) {
      let vm = this
      let params = {
        roleId: item.roleId
      }
      vm.$confirm({
        title: 'warning',
        content: vm.$i18n.t('countryList.confirmFreeze'),
        okText: vm.$i18n.t('common.ok'),
        cancelText: vm.$i18n.t('common.cancel'),
        onOk () {
          postToken(urls.freezeRole, params).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.success(vm.$i18n.t('countryList.freezeSuccess'))
              item.isDelete = 0
            } else {
              vm.$message.error(vm.$i18n.t('countryList.freezeFalse'))
            }
          }, () => {
            vm.$message.error(vm.$i18n.t('countryList.freezeFalse'))
          })
        },
        onCancel () {
        }
      })
    },
    turnPage (page, pageSize) {
      let vm = this
      vm.cur = page
      let countryCode = sessionStorage.getItem('countryCode')
      if (countryCode === '' || countryCode === undefined) {
        countryCode = 'ALL'
      }
      let param = {
        pageSize: vm.pageSize,
        currentPage: vm.cur,
        countryCode: countryCode,
        ...vm.searchOptions
      }
      vm.getOnePage(urls.getRole, param)
    },
    getOnePage (url, params) {
      let vm = this
      this.spinning = true
      postToken(url, params).then(res => {
        let code = res.data.code
        let response = res.data.data
        if (code === '10000') {
          vm.data = response.data
          vm.total = response.totalPage
        } else {
          vm.$message.error(vm.$i18n.t('common.getDataFalse'))
        }
        this.spinning = false
      }).catch(() => {
        vm.$message.error(vm.$i18n.t('common.getDataError'))
      })
    },
    // 打开搜索
    openSearch () {
      this.visible = true
      this.drawerStatus = 0
      this.drawerWidth = '40vw'
    },
    // 打开详情面板
    openDetail (item, type) {
      this.visible = true
      this.drawerWidth = '65vw'
      this.initObject = item
      this.drawerStatus = type
    },
    // 打开配置权限
    openPerm (id) {
      this.visible = true
      this.drawerWidth = '45vw'
      this.setUid = id
      this.drawerStatus = 3
    },
    // 重置搜索
    fresh () {
      this.searchOptions = {}
      this.turnPage(1)
      this.showTags = {}
    },
    // 搜索
    search (opt) {
      let vm = this
      vm.searchOptions = opt.data
      vm.turnPage(opt.cur)
    },
    // tags
    editTags (opt) {
      this.showTags = opt
    },
    // 关闭抽屉
    drawerClose () {
      this.visible = false
    }
  },
  computed: {
    showSearchTags () { // 显示tag标签
      let vm = this
      let str = ''
      for (let k in vm.showTags) {
        str += `<span class="ant-tag ant-tag-orange">${vm.showTags[k]}</span>`
      }
      return str
    },
    drawerTitle () {
      let tit
      switch (this.drawerStatus) {
        case 0:
          tit = this.$i18n.t('common.Search')
          break
        case 1:
          tit = this.$i18n.t('common.Add')
          break
        case 2:
          tit = this.$i18n.t('common.detail')
          break
        case 3:
          tit = this.$i18n.t('roleList.setPerm')
          break
      }
      return tit
    }
  }
}
</script>

<style scoped>

</style>
