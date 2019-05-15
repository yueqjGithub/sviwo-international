<template>
  <div>
    <div class="btnGroup">
      <!--        <a-button type="primary">search</a-button>-->
<!--      <a-button type="primary" icon="plus" @click="openDetail(null,1)">{{$t('common.Add')}}</a-button>-->
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
          :label="$t('orderList.orderId')"
          fixed="left"
          prop="orderId"
        >
        </el-table-column>
        <el-table-column
          :label="$t('orderList.countryName')"
          prop="countryName"
        >
        </el-table-column>
        <el-table-column
          :label="$t('orderList.startAddress')"
          prop="startAddress"
        ></el-table-column>
        <el-table-column
          :label="$t('orderList.endAddress')"
          prop="endAddress"
        ></el-table-column>
        <el-table-column
          :label="$t('orderList.dmobileNumber')"
          prop="dmobileNumber"
          width="160"
        >
          <template slot-scope="scope">
            <span>{{scope.row.dmobileArea}}{{scope.row.dmobileNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('orderList.pmobileNumber')"
          prop="pmobileNumber"
          width="160"
        >
          <template slot-scope="scope">
            <span>{{scope.row.pmobileArea}}{{scope.row.pmobileNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('orderList.orderPrice')"
          prop="orderPrice"
        ></el-table-column>
        <el-table-column
          :label="$t('orderList.orderType')"
          prop="orderType"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.orderType === 'Dispatch'">{{$t('orderList.Dispatch')}}</span>
            <span v-if="scope.row.orderType === 'Charge'">{{$t('orderList.Charge')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('orderList.orderStatus')"
          prop="orderStatus"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.orderType === 'Dispatch' && scope.row.orderStatus === 1">{{$t('orderList.dispatch1')}}</span>
            <span v-if="scope.row.orderType === 'Dispatch' && scope.row.orderStatus === 2">{{$t('orderList.dispatch2')}}</span>
            <span v-if="scope.row.orderType === 'Dispatch' && scope.row.orderStatus === 3">{{$t('orderList.dispatch3')}}</span>
            <span v-if="scope.row.orderType === 'Dispatch' && scope.row.orderStatus === 4">{{$t('orderList.dispatch4')}}</span>
            <span v-if="scope.row.orderType === 'Dispatch' && scope.row.orderStatus === 5">{{$t('orderList.dispatch5')}}</span>
            <span v-if="scope.row.orderType === 'Dispatch' && scope.row.orderStatus === 6">{{$t('orderList.dispatch6')}}</span>
            <span v-if="scope.row.orderType === 'Dispatch' && scope.row.orderStatus === 7">{{$t('orderList.dispatch7')}}</span>
            <span v-if="scope.row.orderType === 'Dispatch' && scope.row.orderStatus === 8">{{$t('orderList.dispatch8')}}</span>
            <span v-if="scope.row.orderType === 'Dispatch' && scope.row.orderStatus === 9">{{$t('orderList.dispatch9')}}</span>
            <span v-if="scope.row.orderType === 'Charge' && scope.row.orderStatus === 0">{{$t('orderList.charge0')}}</span>
            <span v-if="scope.row.orderType === 'Charge' && scope.row.orderStatus === 1">{{$t('orderList.charge1')}}</span>
            <span v-if="scope.row.orderType === 'Charge' && scope.row.orderStatus === 2">{{$t('orderList.charge2')}}</span>
            <span v-if="scope.row.orderType === 'Charge' && scope.row.orderStatus === 3">{{$t('orderList.charge3')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('common.Action')"
          fixed="right"
          width="180"
        >
          <template slot-scope="scope">
            <a-button type="primary" size="small" @click="openDetail(scope.row, 1)">{{$t('common.detail')}}</a-button>
            <a-button
              type="primary"
              size="small"
              v-if="scope.row.orderType === 'Dispatch' && scope.row.orderStatus < 5"
              @click="openDetail(scope.row, 1)"
            >{{$t('orderList.closeOrder')}}</a-button>
            <a-button
              type="primary"
              size="small"
              v-if="scope.row.orderType === 'Charge' && scope.row.orderStatus === 0"
              @click="openDetail(scope.row, 1)"
            >{{$t('orderList.closeOrder')}}</a-button>
          </template>
        </el-table-column>
      </el-table>
    </a-spin>
<!--    -&#45;&#45;弹出层&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
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
      <detail :init = 'initObject' v-if="drawerStatus === 1" @turnStatus="turnStatus"></detail>
    </a-drawer>
  </div>
</template>

<script>
import urls from '@/config/api'
import { postToken } from '@/config/extendAXIOS'
// import { MessageBox } from 'element-ui'
import search from '@/pages/order/search'
import detail from '@/pages/order/detail'
export default {
  name: 'orderList',
  components: {
    search,
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
      drawerStatus: 0 // 0-搜索，1-详情
    }
  },
  created () {
    let countryCode = sessionStorage.getItem('countryCode')
    let param = {
      pageSize: this.pageSize,
      currentPage: 1,
      countryCode: countryCode
    }
    this.getOnePage(urls.getOrderList, param)
  },
  methods: {
    // test
    turnStatus (payload) {
      let order = this.data.find(item => item.orderId === payload.orderId)
      let num = this.data.indexOf(order)
      this.visible = false
      if (num !== -1) {
        this.data.splice(num, 1)
      }
    },
    // 关闭订单
    // closeHandle (order) {
    //   let vm = this
    //   MessageBox.prompt(vm.$i18n.t('orderList.closeTit'), '', {
    //     confirmButtonText: vm.$i18n.t('audit.submit'),
    //     cancelButtonText: vm.$i18n.t('audit.cancel')
    //   }).then(({ value }) => {
    //     let param = {
    //       orderId: order.orderId,
    //       closeReason: value,
    //       orderType: order.orderType
    //     }
    //     postToken(urls.closeOrder, param).then(res => {
    //       let code = res.data.code
    //       if (code === '10000') {
    //         vm.$message.success(vm.$i18n.t('common.success'))
    //         if (order.orderType === 'Dispatch') {
    //           order.orderStatus = 9
    //         } else if (order.orderType === 'Charge') {
    //           order.orderStatus = 3
    //         }
    //       } else {
    //         vm.$message.error(vm.$i18n.t('common.false'))
    //       }
    //     }).catch(_ => {
    //       vm.$message.error(vm.$i18n.t('common.false'))
    //     })
    //   }).catch(() => {
    //   })
    // },
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
    openSearch () {
      this.visible = true
      this.drawerWidth = '40vw'
      this.drawerStatus = 0
    },
    // 打开详情面板
    openDetail (item, type) {
      this.visible = true
      this.drawerWidth = '55vw'
      this.initObject = item
      this.drawerStatus = type
    },
    drawerClose () {
      this.visible = false
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
      vm.getOnePage(urls.getOrderList, param)
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
