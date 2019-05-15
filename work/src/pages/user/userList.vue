<template>
  <div>
    <div class="btnGroup">
      <a-button type="primary" icon="plus" @click="openDetail(null,1)">{{$t('common.Add')}}</a-button>
<!--      <a-button type="primary" icon="search" class="group-btn" @click="openSearch">{{$t('common.Search')}}</a-button>-->
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
          :label="$t('userList.userName')"
          prop="sysUserName"
          fixed="left"
        >
          <template slot-scope="scope">
            <a href="javascript:;" @click.prevent="openDetail(scope.row,2)">{{scope.row.sysUserName}}</a>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('userList.countryName')"
          prop="countryName"
        >
        </el-table-column>
        <el-table-column
          :label="$t('userList.roleName')"
          prop="roleName"
        >
        </el-table-column>
        <el-table-column
          :label="$t('userList.createTime')"
          prop="createTime"
        >
        </el-table-column>
        <el-table-column
          :label="$t('userList.updateTime')"
          prop="updateTime"
        >
        </el-table-column>
        <el-table-column
          :label="$t('common.Action')"
          fixed="right"
          width="300"
        >
          <template slot-scope="scope">
            <a-button type="primary" icon="reload" @click="reset(scope.row)" size="small">{{$t('userList.resetPWD')}}</a-button>
            <a-button size="small" type="primary" v-if="!scope.row.enabled" @click="throwCountry(scope.row)">{{$t('countryList.Thraw')}}</a-button>
            <a-button size="small" type="primary" v-if="scope.row.enabled" @click="freezeCountry(scope.row)">{{$t('countryList.freeze')}}</a-button>
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
    </a-drawer>
  </div>
</template>

<script>
import urls from '@/config/api'
import { postToken } from '@/config/extendAXIOS'
import search from '@/pages/user/search'
import detail from '@/pages/user/detail'
export default {
  name: 'userList',
  components: {
    search,
    detail
  },
  data () {
    return {
      allUserList: [], // 所有用户组
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
    let sysUserId = sessionStorage.getItem('sysUserId')
    let countryCode = sessionStorage.getItem('countryCode')
    let params = {
      pageSize: 20, // 每页多少条数据
      currentPage: 1, // 第几页
      sysUserId: sysUserId,
      countryCode: countryCode
    }
    this.getOnePage(urls.getUser, params)
  },
  methods: {
    // 解冻
    throwCountry (item) {
      let vm = this
      let params = {
        userId: item.sysUserId
      }
      vm.$confirm({
        title: 'warning',
        content: vm.$i18n.t('countryList.confirmThrow'),
        okText: vm.$i18n.t('common.ok'),
        cancelText: vm.$i18n.t('common.cancel'),
        onOk () {
          postToken(urls.unFreezeUser, params).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.success(vm.$i18n.t('countryList.throwSuccess'))
              item.enabled = !item.enabled
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
        userId: item.sysUserId
      }
      vm.$confirm({
        title: 'warning',
        content: vm.$i18n.t('countryList.confirmFreeze'),
        okText: vm.$i18n.t('common.ok'),
        cancelText: vm.$i18n.t('common.cancel'),
        onOk () {
          postToken(urls.freezeUser, params).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.success(vm.$i18n.t('countryList.freezeSuccess'))
              item.enabled = !item.enabled
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
    // 重置密码
    reset (user) {
      let vm = this
      vm.$confirm({
        okText: vm.$i18n.t('common.ok'),
        cancelText: vm.$i18n.t('common.cancel'),
        title: vm.$i18n.t('common.warning'),
        content: vm.$i18n.t('userList.resetContent'),
        onOk () {
          // let params = user
          let newPwd = Math.random().toString(36).substr(2, 8)
          // user.password = newPwd
          let params = {
            sysUserId: user.sysUserId,
            sysUserPassword: newPwd
          }
          postToken(urls.resetPassword, params).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$notification.open({
                message: vm.$i18n.t('common.success'),
                description: `${vm.$i18n.t('userList.resetSuccess') + newPwd}`,
                duration: 0
              })
            } else {
              vm.$message.error(vm.$i18n.t('common.false'))
            }
          }).catch(_ => {
            vm.$message.error(vm.$i18n.t('common.false'))
          })
        }
      })
    },
    // turnPage (page, pageSize) {
    //   let vm = this
    //   vm.cur = page
    //   let countryCode = sessionStorage.getItem('countryCode')
    //   let param = {
    //     pageSize: vm.pageSize,
    //     currentPage: vm.cur,
    //     countryCode: countryCode,
    //     ...vm.searchOptions
    //   }
    //   vm.getOnePage(urls.getUser, param)
    // },
    turnPage (page, pageSize) {
      let vm = this
      vm.cur = page
      vm.data = []
      for (let k in vm.allUserList) {
        if (k <= vm.cur * 10 && k > (vm.cur - 1) * 10) {
          vm.data.push(vm.allUserList[k])
        }
      }
    },
    getOnePage (url, params) {
      let vm = this
      this.spinning = true
      postToken(url, params).then(res => {
        let code = res.data.code
        let response = res.data.data
        if (code === '10000') {
          // vm.data = response.data
          // vm.total = response.length
          vm.allUserList = response
          vm.total = response.length / 10
          for (let k in response) {
            if (k < vm.cur * 10 && k >= (vm.cur - 1) * 10) {
              vm.data.push(response[k])
            }
          }
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
    },
    // 打开详情面板
    openDetail (item, type) {
      this.visible = true
      this.drawerWidth = '65vw'
      this.initObject = item
      this.drawerStatus = type
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
      }
      return tit
    }
  }
}
</script>

<style scoped>

</style>
