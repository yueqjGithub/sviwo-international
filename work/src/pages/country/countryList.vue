<template>
    <div>
      <div class="btnGroup">
<!--        <a-button type="primary">search</a-button>-->
        <a-button type="primary" @click="openDrawer(0)" icon="plus">{{$t('common.Add')}}</a-button>
      </div>
<!--      <div class="middleMode">-->
<!--        <div style="margin-left: 8px;">-->
<!--          <div>-->
<!--            {{$t('common.searchTit')}}:-->
<!--            <span v-html="showSearchOptions"></span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="pageGroup">-->
<!--          <a-pagination simple :defaultCurrent="cur" :total="total" @change="turnPage"/>-->
<!--        </div>-->
<!--      </div>-->
<!--      table-->
      <a-spin :spinning="spinning">
        <el-table
          :data="data"
          height="78vmin"
        >
          <el-table-column
            fixed="left"
            :label="$t('countryList.CountryName')"
          >
            <template slot-scope="scope">
              <a href="javascript:;" @click="openDrawer(1,scope.row)">{{scope.row.countryName}}</a>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('countryList.Unit')"
            prop="currencyCode"
          >
          </el-table-column>
          <el-table-column
            :label="$t('countryList.Symbol')"
            prop="currencySymbol"
          >
          </el-table-column>
          <el-table-column
            :label="$t('countryList.BaseFare')"
            prop="baseFare"
          >
          </el-table-column>
          <el-table-column
            :label="$t('countryList.BaseMiles')"
            prop="baseRange"
          >
          </el-table-column>
          <el-table-column
            :label="$t('countryList.MilesFare')"
            prop="milesFare"
          >
          </el-table-column>
          <el-table-column
            :label="$t('countryList.TimeFare')"
            prop="timeFare"
          >
          </el-table-column>
          <el-table-column
            :label="$t('countryList.RemoteFare')"
            prop="remoteFare"
          >
          </el-table-column>
          <el-table-column
          :label="$t('countryList.Action')"
          fixed="right"
          >
            <template slot-scope="scope">
              <a-button type="danger" size="small" v-if="scope.row.isDelete === 1" @click="freezeCountry(scope.row)">{{$t('countryList.freeze')}}</a-button>
              <a-button type="primary" size="small" v-if="scope.row.isDelete === 0" @click="throwCountry(scope.row)">{{$t('countryList.Thraw')}}</a-button>
            </template>
          </el-table-column>
        </el-table>
      </a-spin>
<!--      drawer-->
      <a-drawer
        placement="right"
        :closable="true"
        :maskClosable="false"
        :title=drawerTitle
        @close="drawerClose"
        :visible="visible"
        width="40vw"
        :destroyOnClose="true"
      >
        <detail :type="addOrEdit" :obj="editObject"></detail>
      </a-drawer>
    </div>
</template>

<script>
import urls from '@/config/api'
import { postToken } from '@/config/extendAXIOS'
import detail from '@/pages/country/countryDetail'

export default {
  name: 'countryList',
  components: {
    detail: detail
  },
  data () {
    return {
      cur: 1,
      total: 1,
      spinning: false,
      visible: false,
      data: [],
      searchTags: {},
      addOrEdit: 0, // 0-增加，1-修改
      editObject: {},
      isMaster: false
    }
  },
  created () {
    let vm = this
    let countryCode = sessionStorage.getItem('countryCode')
    let params = {
      countryCode: countryCode
    }
    vm.spinning = true
    postToken(urls.getCountry, params).then(res => {
      let code = res.data.code
      if (code === '10000') {
        vm.data = res.data.data
      } else {
        vm.$message.error(vm.$i18n.t('common.getDataFalse'))
      }
      vm.spinning = false
    }, () => {
      vm.$message.error(vm.$i18n.t('common.getDataError'))
      vm.spinning = false
    })
  },
  mounted () {
    let userCountry = sessionStorage.getItem('countryCode')
    if (!userCountry) {
      this.isMaster = true
    } else {
      this.isMaster = false
    }
  },
  methods: {
    turnPage (page, pageSize) {
      console.log(page)
    },
    drawerClose () {
      this.visible = false
    },
    openDrawer (type, obj) {
      this.addOrEdit = type
      this.visible = true
      if (type === 1) {
        this.editObject = obj
      }
    },
    freezeCountry (item) {
      let vm = this
      let params = {
        countryId: item.countryId
      }
      vm.$confirm({
        title: 'warning',
        content: vm.$i18n.t('countryList.confirmFreeze'),
        okText: vm.$i18n.t('common.ok'),
        cancelText: vm.$i18n.t('common.cancel'),
        onOk () {
          postToken(urls.freezeCountry, params).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.success(vm.$i18n.t('countryList.freezeSuccess'))
              item.isDelete = 0
            } else {
              vm.$message.success(vm.$i18n.t('countryList.freezeFalse'))
            }
          }, () => {
            vm.$message.success(vm.$i18n.t('countryList.freezeFalse'))
          })
        },
        onCancel () {
        }
      })
    },
    throwCountry (item) {
      let vm = this
      let params = {
        countryId: item.countryId
      }
      vm.$confirm({
        title: 'warning',
        content: vm.$i18n.t('countryList.confirmThrow'),
        okText: vm.$i18n.t('common.ok'),
        cancelText: vm.$i18n.t('common.cancel'),
        onOk () {
          postToken(urls.unFreezeCountry, params).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.success(vm.$i18n.t('countryList.throwSuccess'))
              item.isDelete = 1
            } else {
              vm.$message.success(vm.$i18n.t('countryList.throwFalse'))
            }
          }, () => {
            vm.$message.error(vm.$i18n.t('countryList.throwFalse'))
          })
        },
        onCancel () {
        }
      })
    }
  },
  computed: {
    showSearchOptions () { // 显示tag标签
      let vm = this
      let str = ''
      for (let k in vm.searchTags) {
        str += `<span class="ant-tag ant-tag-orange">${vm.searchOptions[k]}</span>`
      }
      return str
    },
    drawerTitle () {
      let tit = this.addOrEdit === 0 ? this.$i18n.t('addCountry.addTitle') : this.$i18n.t('addCountry.editTitle')
      return tit
    }
  }
}
</script>

<style scoped>
.btnGroup{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 8px;
}
.group-btn{
  margin-left: 4px;
}
.middleMode{
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
  height: 48px;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.pageGroup{
  margin-right: 8px;
}
</style>
