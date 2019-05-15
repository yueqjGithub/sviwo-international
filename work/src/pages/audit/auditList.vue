<template>
  <div>
    <!--      中间部分-->
    <div class="middleMode">
      <div style="margin-left: 8px;">
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
              <span v-if="scope.row.countryCode === 'CN'">{{scope.row.lastName}}{{scope.row.firstName}}</span>
              <span v-else>{{scope.row.firstName}}{{scope.row.lastName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('driverList.mobileNumber')"
          prop="mobileNumber"
        ></el-table-column>
        <el-table-column
          :label="$t('driverList.certificateNo')"
          prop="certificateNo"
        ></el-table-column>
        <el-table-column
          :label="$t('driverList.countryName')"
        >
          <template slot-scope="scope">
            <span v-if="lang === 'CN'">{{cList.find(item => item.locale === scope.row.countryCode).zh}}</span>
            <span v-if="lang === 'EN'">{{cList.find(item => item.locale === scope.row.countryCode).en}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('driverList.drivingCountry')"
        >
          <template slot-scope="scope">
            <span v-if="lang === 'CN'">{{cList.find(item => item.locale === scope.row.drivingCountry).zh}}</span>
            <span v-if="lang === 'EN'">{{cList.find(item => item.locale === scope.row.drivingCountry).en}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('driverList.refuseReason')"
          prop="remark"
        ></el-table-column>
        <el-table-column
          :label="$t('common.Action')"
          fixed="right"
        >
          <template slot-scope="scope">
            <a-button size="small" type="primary" v-if="scope.row.driverStatus === 1" @click="openDetail(scope.row,2)">{{$t('driverList.examine')}}</a-button>
            <a-button size="small" type="primary" v-if="scope.row.driverStatus === 3" @click="openDetail(scope.row,2)">{{$t('driverList.reExamine')}}</a-button>
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
      <detail :init = 'initObject' :view="drawerStatus" v-if="drawerStatus === 1 || drawerStatus === 2"></detail>
    </a-drawer>
  </div>
</template>

<script>
import urls from '@/config/api'
import { postToken } from '@/config/extendAXIOS'
import cList from '@/config/countryList'
import detail from '@/pages/audit/detail'
export default {
  name: 'auditList',
  components: {
    detail
  },
  data () {
    const lang = localStorage.getItem('lang')
    const cList2 = () => {
      let list = []
      let code = sessionStorage.getItem('countryCode')
      if (code !== '' && code !== null) {
        list.push(cList.find(item => item.locale === code))
      } else {
        list = cList
      }
      return list
    }
    return {
      cList,
      countryList: cList2(),
      lang: lang,
      initObject: {},
      spinning: false,
      data: [],
      cur: 1,
      total: 1,
      pageSize: 20,
      visible: false, // 是否显示抽屉
      drawerWidth: '40vw',
      drawerStatus: 0 // 0-搜索，1-审核，2-修改
    }
  },
  created () {
    let countryCode = sessionStorage.getItem('countryCode')
    let param = {
      pageSize: this.pageSize,
      currentPage: 1,
      countryCode: countryCode
    }
    this.getOnePage(urls.getDriverAuditList, param)
  },
  methods: {
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
        countryCode: countryCode
      }
      vm.getOnePage(urls.getPassengerList, param)
    },
    drawerClose () {
      this.visible = false
    },
    openDetail (item, type) {
      this.visible = true
      this.drawerWidth = '65vw'
      this.initObject = item
      this.drawerStatus = type
    }
  },
  computed: {
    drawerTitle () {
      let tit = ''
      switch (this.drawerStatus) {
        case 0:
          tit = this.$i18n.t('common.Search')
          break
        case 1:
          tit = this.$i18n.t('driverList.examine')
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
