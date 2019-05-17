<template>
  <div>
    <div class="btnGroup">
      <!--        <a-button type="primary">search</a-button>-->
            <a-button type="primary" icon="plus" @click="openDetail(null,1)">{{$t('common.Add')}}</a-button>
<!--      <a-button type="primary" icon="search" class="group-btn" @click="openSearch">{{$t('common.Search')}}</a-button>-->
    </div>
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
          label="类型名称"
          fixed="left"
          prop="typeName"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.doSubmit">{{scope.row.typeName}}</span>
            <a-input v-model="scope.row.typeName" v-if="scope.row.doSubmit"></a-input>
          </template>
        </el-table-column>
        <el-table-column
          label="类型编码"
          prop="code"
        ></el-table-column>
        <el-table-column
          label="备注"
          prop="remark"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.doSubmit">{{scope.row.remark}}</span>
            <a-input v-model="scope.row.remark" v-if="scope.row.doSubmit"></a-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="180"
        >
          <template slot-scope="scope">
            <div v-if="!scope.row.doSubmit">
              <a-button type="primary" @click="test(scope.row)" size="small" :disabled="doModify">修改</a-button>
              <a-button type="primary" size="small" :disabled="doModify">参数明细</a-button>
            </div>
            <div v-if="scope.row.doSubmit">
              <a-button type="danger" size="small" @click="saveModify(scope.row)" :disabled="saving" :loading="saving">保存</a-button>
              <a-button size="small" @click="cancelModify(scope.row)" :disabled="saving" :loading="saving">取消</a-button>
            </div>
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
<!--      <search @doSearch="search" @subTags="editTags" v-if="drawerStatus === 0" @refresh="fresh"></search>-->
      <detail v-if="drawerStatus === 1" @refresh="refresh" @off="drawerClose"></detail>
    </a-drawer>
  </div>
</template>

<script>
import urls from '@/config/api'
import { postToken } from '@/config/extendAXIOS'
import detail from '@/pages/sysConfig/detail'
export default {
  name: 'dicType',
  components: {
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
      pageSize: 50,
      visible: false, // 是否显示抽屉
      drawerWidth: '40vw',
      drawerStatus: 0, // 0-搜索，1-详情
      // ----test---------
      doModify: false,
      saving: false,
      oldObj: {
        code: '',
        dicTypeId: '',
        remark: '',
        typeName: ''
      }
    }
  },
  created () {
    this.refresh()
  },
  methods: {
    test (obj) {
      // this.oldObj = obj
      for (let k in obj) {
        this.oldObj[k] = obj[k]
      }
      obj['doSubmit'] = 1
      this.doModify = true
    },
    saveModify (obj) {
      let vm = this
      let param = {
        code: obj.code,
        dicTypeId: obj.dicTypeId,
        remark: obj.remark,
        typeName: obj.typeName
      }
      if (param.typeName === '') {
        vm.$message.error('类型名称不能为空')
        return false
      }
      this.saving = true
      this.$confirm({
        title: '确认要修改吗？',
        content: '该操作会影响APP用户相关操作，请谨慎操作',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          postToken(urls.addOrUpdateDicType, param).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.success('操作成功')
              for (let k in param) {
                obj[k] = param[k]
              }
            } else {
              vm.$message.error('操作失败-then')
            }
            vm.saving = false
          }).catch(_ => {
            vm.$message.error('操作失败-catch')
            vm.saving = false
          })
        },
        onCancel () {
          vm.saving = false
        }
      })
    },
    cancelModify (obj) {
      this.doModify = false
      for (let k in this.oldObj) {
        obj[k] = this.oldObj[k]
      }
      obj['doSubmit'] = undefined
    },
    refresh () {
      this.cur = 1
      let param = {
        pageSize: this.pageSize,
        currentPage: this.cur
      }
      this.getOnePage(urls.getDicType, param)
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
    openDetail (item, type) {
      this.visible = true
      this.drawerWidth = '55vw'
      this.initObject = item
      this.drawerStatus = type
    },
    turnPage (page, pageSize) {
      let vm = this
      vm.cur = page
      let param = {
        pageSize: vm.pageSize,
        currentPage: vm.cur,
        ...vm.searchOptions
      }
      this.getOnePage(urls.getDicType, param)
    },
    drawerClose () {
      this.visible = false
    }
  },
  computed: {
    drawerTitle () {
      let tit = ''
      switch (this.drawerStatus) {
        case 0:
          tit = '添加'
          break
        case 1:
          tit = '明细'
          break
      }
      return tit
    }
  }
}

</script>

<style scoped>

</style>
