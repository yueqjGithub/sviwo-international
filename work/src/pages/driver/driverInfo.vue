<template>
  <div>
    <div class="btnGroup">
      <!--        <a-button type="primary">search</a-button>-->
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
        :label="$t('driverList.name')"
        fixed="left"
        >
          <template slot-scope="scope">
            <a href="javascript:;" @click="openDetail(scope.row,2)">
              <span v-if="scope.row.countryCode === 'CN'">{{scope.row.lastName}}{{scope.row.firstName}}</span>
              <span v-else>{{scope.row.firstName}}{{scope.row.lastName}}</span>
            </a>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('driverList.mobileNumber')"
          prop="mobileNumber"
        ></el-table-column>
        <el-table-column
          :label="$t('driverList.driverSex')"
          prop="driverSex"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.driverSex === 1">male</span>
            <span v-if="scope.row.driverSex === 0">female</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('driverList.vehicleNumber')"
          prop="vehicleNumber"
        >
          <template slot-scope="scope">
            <router-link :to="{path:'/vehicleList',query: {option: scope.row.vehicleNumber}}">{{scope.row.vehicleNumber}}</router-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('driverList.drivingCountry')"
          prop="drivingCountry"
        ></el-table-column>
        <el-table-column
          :label="$t('driverList.telCountry')"
          prop="telCountry"
        ></el-table-column>
        <el-table-column
          :label="$t('common.Action')"
          fixed="right"
        >
          <template slot-scope="scope">
            <a-button icon="unlock" size="small" type="primary" v-if="scope.row.driverStatus === 4" @click="throwCountry(scope.row)">{{$t('countryList.Thraw')}}</a-button>
            <a-button icon="lock" size="small" type="primary" v-if="scope.row.driverStatus === 2" @click="freezeCountry(scope.row)">{{$t('countryList.freeze')}}</a-button>
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
      <search-driver @doSearch="search" @subTags="editTags" v-if="drawerStatus === 0" @refresh="fresh"></search-driver>
      <detail :init = 'initObject' :view="drawerStatus" v-if="drawerStatus === 1 || drawerStatus === 2"></detail>
    </a-drawer>
  </div>
</template>

<script>
import urls from '@/config/api'
import { postToken } from '@/config/extendAXIOS'
import searchDriver from '@/pages/driver/search'
import detail from '@/pages/driver/driverDetail'
export default {
  name: 'driverInfo',
  components: {
    searchDriver,
    detail
  },
  data () {
    return {
      initObject: {},
      spinning: false,
      data: [],
      searchOptions: {}, // 存放搜索参数
      showTags: {}, // 存放搜索Tags显示
      cur: 1,
      total: 1,
      pageSize: 20,
      visible: false, // 是否显示抽屉
      drawerWidth: '40vw',
      drawerStatus: 0 // 0-搜索，1-添加，2-修改
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
    this.getOnePage(urls.getDriverList, params)
  },
  methods: {
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
    drawerClose () {
      this.visible = false
    },
    // 解冻
    throwCountry (item) {
      let vm = this
      let params = {
        driverId: item.driverId
      }
      vm.$confirm({
        title: 'warning',
        content: vm.$i18n.t('countryList.confirmThrow'),
        okText: vm.$i18n.t('common.ok'),
        cancelText: vm.$i18n.t('common.cancel'),
        onOk () {
          postToken(urls.unFreezeDriver, params).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.success(vm.$i18n.t('countryList.throwSuccess'))
              item.driverStatus = 2
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
        driverId: item.driverId
      }
      vm.$confirm({
        title: 'warning',
        content: vm.$i18n.t('countryList.confirmFreeze'),
        okText: vm.$i18n.t('common.ok'),
        cancelText: vm.$i18n.t('common.cancel'),
        onOk () {
          postToken(urls.freezeDriver, params).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.success(vm.$i18n.t('countryList.freezeSuccess'))
              item.driverStatus = 4
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
      vm.getOnePage(urls.getDriverList, param)
    },
    // 打开搜索
    openSearch () {
      this.visible = true
      this.drawerWidth = '40vw'
      this.drawerStatus = 0
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
      let tit = ''
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
