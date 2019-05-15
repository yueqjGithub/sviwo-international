<template>
  <div>
    <div class="btnGroup">
      <!--        <a-button type="primary">search</a-button>-->
<!--      <a-button type="primary" icon="plus">{{$t('common.Add')}}</a-button>-->
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
          fixed="left"
          :label="$t('passengerList.tel')"
          prop="mobileNumber"
        ></el-table-column>
        <el-table-column
          :label="$t('passengerList.username')"
          prop="username"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.username === 'nullnull' || scope.row.username === 'null null'">NULL</span>
            <span v-else>{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('passengerList.passengerSex')"
          prop="passengerSex"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.passengerSex === 1">male</span>
            <span v-if="scope.row.passengerSex === 0">female</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="countryName"
          :label="$t('passengerList.countryName')"
        ></el-table-column>
        <el-table-column
          prop="birthday"
          :label="$t('passengerList.birthday')"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          :label="$t('passengerList.createTime')"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="loginTime"
          :label="$t('passengerList.loginTime')"
          width="160"
        ></el-table-column>
        <el-table-column
          :label="$t('common.Action')"
          fixed="right"
        >
          <template slot-scope="scope">
            <a-button size="small" type="primary" v-if="scope.row.passengerStatus === 0" @click="throwCountry(scope.row)">{{$t('countryList.Thraw')}}</a-button>
            <a-button size="small" type="primary" v-if="scope.row.passengerStatus === 1" @click="freezeCountry(scope.row)">{{$t('countryList.freeze')}}</a-button>
          </template>
        </el-table-column>
      </el-table>
    </a-spin>
    <!--      -drawer- -->
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
<!--      <search-car @doSearch="search" @subTags="editTags" v-if="drawerStatus === 0" @refresh="fresh"></search-car>-->
      <search-pas @doSearch="search" @subTags="editTags" @refresh="fresh"></search-pas>
    </a-drawer>
  </div>
</template>

<script>
import urls from '@/config/api'
import { postToken } from '@/config/extendAXIOS'
import searchPas from '@/pages/passenger/search'
export default {
  name: 'passenger',
  components: {
    searchPas
  },
  data () {
    return {
      spinning: false,
      data: [],
      searchOptions: {}, // 存放搜索参数
      showTags: {}, // 存放搜索Tags显示
      cur: 1,
      total: 1,
      pageSize: 20,
      visible: false, // 是否显示抽屉
      drawerWidth: '40vw'
    }
  },
  created () {
    let countryCode = sessionStorage.getItem('countryCode')
    let opt = this.$route.query.option
    let params = {}
    if (opt) {
      params = {
        pageSize: 20,
        currentPage: 1,
        countryCode: countryCode,
        mobileNumber: opt
      }
    } else {
      params = {
        pageSize: this.pageSize,
        currentPage: 1,
        countryCode: countryCode
      }
    }
    this.getOnePage(urls.getPassengerList, params)
  },
  methods: {
    // 解冻
    throwCountry (item) {
      let vm = this
      let params = {
        passengerId: item.passengerId
      }
      vm.$confirm({
        title: 'warning',
        content: vm.$i18n.t('countryList.confirmThrow'),
        okText: vm.$i18n.t('common.ok'),
        cancelText: vm.$i18n.t('common.cancel'),
        onOk () {
          postToken(urls.unFreezePassenger, params).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.success(vm.$i18n.t('countryList.throwSuccess'))
              item.passengerStatus = 1
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
        passengerId: item.passengerId
      }
      vm.$confirm({
        title: 'warning',
        content: vm.$i18n.t('countryList.confirmFreeze'),
        okText: vm.$i18n.t('common.ok'),
        cancelText: vm.$i18n.t('common.cancel'),
        onOk () {
          postToken(urls.freezePassenger, params).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.success(vm.$i18n.t('countryList.freezeSuccess'))
              item.passengerStatus = 0
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
    // 打开搜索
    openSearch () {
      this.visible = true
      this.drawerWidth = '40vw'
    },
    // 关闭抽屉
    drawerClose () {
      this.visible = false
    },
    turnPage (page, pageSize) {
      let vm = this
      vm.cur = page
      let countryCode = sessionStorage.getItem('countryCode')
      let param = {
        pageSize: vm.pageSize,
        currentPage: vm.cur,
        countryCode: countryCode,
        ...vm.searchOptions
      }
      vm.getOnePage(urls.getPassengerList, param)
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
    }
  },
  computed: {
    showSearchTags () { // 显示tag标签
      let vm = this
      let str = ''
      let num = 0
      for (let k in vm.showTags) {
        num++
        str += `<span class="ant-tag ant-tag-orange">${vm.showTags[k]}</span>`
      }
      if (num === 0) {
        str = `<span></span>`
      }
      return str
    },
    drawerTitle () {
      return this.$i18n.t('common.Search')
    }
  }
}
</script>

<style scoped>

</style>
