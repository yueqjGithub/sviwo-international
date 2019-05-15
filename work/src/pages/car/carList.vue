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
            fixed="left"
            :label="$t('carList.licensePlates')"
          >
            <template slot-scope="scope">
              <a href="javascript:;" @click.prevent="openDetail(scope.row,2)">{{scope.row.licensePlates}}</a>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('carList.vehicleNumber')"
            prop="vehicleNumber"
          >
          </el-table-column>
          <el-table-column
            :label="$t('carList.carStatus')"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.carStatus === 0">{{$t('carList.undistributed')}}</span>
              <span v-if="scope.row.carStatus === 1">{{$t('carList.allocated')}}</span>
              <span v-if="scope.row.carStatus === 2">{{$t('carList.offline')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('carList.countryName')"
            prop="countryName"
          >
          </el-table-column>
<!--          <el-table-column-->
<!--            :label="$t('common.Action')"-->
<!--            fixed="right"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              <a-button-->
<!--                icon="tool"-->
<!--                size="small"-->
<!--                type="primary"-->
<!--              >-->
<!--                {{$t('carList.reSet')}}-->
<!--              </a-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
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
        <search-car @doSearch="search" @subTags="editTags" v-if="drawerStatus === 0" @refresh="fresh"></search-car>
        <detail :init = 'initObject' :view="drawerStatus" v-if="drawerStatus === 1 || drawerStatus === 2"></detail>
      </a-drawer>
    </div>
</template>

<script>
import urls from '@/config/api'
import { postToken } from '@/config/extendAXIOS'
import searchCar from '@/pages/car/search'
import detail from '@/pages/car/detail'
export default {
  name: 'carList',
  components: {
    searchCar,
    detail
  },
  data () {
    return {
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
    let countryCode = sessionStorage.getItem('countryCode')
    let opt = this.$route.query.option
    let params = {}
    if (opt) {
      params = {
        pageSize: 20,
        currentPage: 1,
        countryCode: countryCode,
        vehicleNumber: opt
      }
    } else {
      params = {
        pageSize: this.pageSize,
        currentPage: 1,
        countryCode: countryCode
      }
    }
    this.getOnePage(urls.getCarList, params)
  },
  methods: {
    // 打开搜索
    openSearch () {
      this.visible = true
      this.drawerStatus = 0
      this.drawerWidth = '40vw'
    },
    // 打开详情面板
    openDetail (item, type) {
      this.visible = true
      this.drawerWidth = '70vw'
      this.initObject = item
      this.drawerStatus = type
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
      vm.getOnePage(urls.getCarList, param)
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
      for (let k in vm.showTags) {
        str += `<span class="ant-tag ant-tag-orange">${vm.showTags[k]}</span>`
      }
      return str
    },
    drawerTitle () {
      let tit
      switch (this.drawerStatus) {
        case 0:
          tit = this.$i18n.t('carList.searchTit')
          break
        case 1:
          tit = this.$i18n.t('carList.addTit')
          break
        case 2:
          tit = this.$i18n.t('carList.resetTit')
          break
      }
      return tit
    }
  }
}
</script>

<style scoped>

</style>
