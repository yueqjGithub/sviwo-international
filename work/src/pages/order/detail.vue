<template>
  <div>
    <h3>{{$t('orderDetail.basic')}}</h3>
    <a-form-item
      :label="$t('orderList.orderId')"
      :label-col="{span: 8}"
      :wrapper-col="wrapperCol"
      :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
    >
      <span>{{orderMode.orderId}}</span>
    </a-form-item>
    <a-form-item
      :label="$t('orderList.orderType')"
      :label-col="{span: 8}"
      :wrapper-col="wrapperCol"
      :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
    >
      <span v-if="orderMode.orderType === 'Dispatch'">{{$t('orderList.Dispatch')}}</span>
      <span v-if="orderMode.orderType === 'Charge'">{{$t('orderList.Charge')}}</span>
    </a-form-item>
    <a-form-item
      :label="$t('orderList.countryName')"
      :label-col="{span: 8}"
      :wrapper-col="wrapperCol"
      :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
    >
      <span>{{orderMode.countryName}}</span>
    </a-form-item>
    <a-form-item
      :label="$t('orderList.orderPrice')"
      :label-col="{span: 8}"
      :wrapper-col="wrapperCol"
      :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
    >
      <span>{{orderMode.orderPrice}}</span>
    </a-form-item>
    <a-form-item
      :label="$t('orderList.startAddress')"
      :label-col="{span: 8}"
      :wrapper-col="wrapperCol"
      :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
    >
      <span>{{orderMode.startAddress}}</span>
    </a-form-item>
    <a-form-item
      :label="$t('orderList.endAddress')"
      :label-col="{span: 8}"
      :wrapper-col="wrapperCol"
      :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
    >
      <span>{{orderMode.endAddress}}</span>
    </a-form-item>
    <a-form-item
      :label="$t('orderList.distance')"
      :label-col="{span: 8}"
      :wrapper-col="wrapperCol"
      :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
    >
      <span>{{orderMode.distance}}Km</span>
    </a-form-item>
    <a-form-item
      :label="$t('orderList.completeDuration')"
      :label-col="{span: 8}"
      :wrapper-col="wrapperCol"
      :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
    >
      <span>{{orderMode.completeDuration}}min</span>
    </a-form-item>
    <a-form-item
      :label="$t('orderList.pmobileNumber')"
      :label-col="{span: 8}"
      :wrapper-col="wrapperCol"
      :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
    >
      <span>{{orderMode.pmobileArea}}{{orderMode.pmobileNumber}}
      <a-button shape="circle" icon="info" size="small" @click="toPage('/passenger', orderMode.pmobileNumber, orderMode.pmobileArea)"></a-button>
      </span>
    </a-form-item>
    <a-form-item
      :label="$t('orderList.dmobileNumber')"
      :label-col="{span: 8}"
      :wrapper-col="wrapperCol"
      :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
    >
      <span>{{orderMode.dmobileArea}}{{orderMode.dmobileNumber}}
      <a-button shape="circle" icon="info" size="small" @click="toPage('/driverInfo', orderMode.dmobileNumber, orderMode.dmobileArea)"></a-button>
      </span>
    </a-form-item>
    <a-form-item
      :label="$t('orderList.vehicleNumber')"
      :label-col="{span: 8}"
      :wrapper-col="wrapperCol"
      :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
    >
      <span>{{orderMode.vehicleNumber}}
        <a-button shape="circle" icon="info" size="small" @click="toPage('/vehicleList', orderMode.vehicleNumber, orderMode.dmobileArea)"></a-button>
      </span>
    </a-form-item>
    <a-form-item
      :label="$t('orderDetail.createTime')"
      :label-col="{span: 8}"
      :wrapper-col="wrapperCol"
      :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
    >
      <span>{{orderMode.createTime}}</span>
    </a-form-item>
    <a-form-item
      :label="$t('orderDetail.endTime')"
      :label-col="{span: 8}"
      :wrapper-col="wrapperCol"
      :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
    >
      <span>{{orderMode.endTime}}</span>
    </a-form-item>
    <a-form-item
      :label="$t('orderDetail.arriveTime')"
      :label-col="{span: 8}"
      :wrapper-col="wrapperCol"
      :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
    >
      <span>{{orderMode.arriveTime}}</span>
    </a-form-item>
    <a-form-item
      :label="$t('orderDetail.boardingTime')"
      :label-col="{span: 8}"
      :wrapper-col="wrapperCol"
      :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
    >
      <span>{{orderMode.boardingTime}}</span>
    </a-form-item>
    <a-form-item
      :label="$t('orderDetail.callTime')"
      :label-col="{span: 8}"
      :wrapper-col="wrapperCol"
      :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
    >
      <span>{{orderMode.callTime}}</span>
    </a-form-item>
    <a-form-item
      :label="$t('orderList.orderStatus')"
      :label-col="{span: 8}"
      :wrapper-col="wrapperCol"
      :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
    >
      <span v-for="k in statusList[orderMode.orderType]" :key="k.key" v-if="orderMode.orderStatus === k.key">{{k.value}}</span>
    </a-form-item>
    <div v-if="showRate">
      <h3>{{$t('orderDetail.otherInfo')}}</h3>
      <a-form-item
        :label="$t('orderDetail.driverStar')"
        :label-col="{span: 8}"
        :wrapper-col="wrapperCol"
        :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
      >
        <a-rate v-model='rateMode.driverStar' disabled/>
      </a-form-item>
      <a-form-item
        :label="$t('orderDetail.speedStar')"
        :label-col="{span: 8}"
        :wrapper-col="wrapperCol"
        :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
      >
        <a-rate v-model='rateMode.speedStar' disabled/>
      </a-form-item>
      <a-form-item
        :label="$t('orderDetail.carStar')"
        :label-col="{span: 8}"
        :wrapper-col="wrapperCol"
        :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
      >
        <a-rate v-model='rateMode.carStar' disabled/>
      </a-form-item>
      <a-form-item
        :label="$t('orderDetail.commentDesc')"
        :label-col="{span: 4}"
        :wrapper-col="wrapperCol"
        :style="{width: 'calc(100% - 8px)'}"
      >
        <span>{{rateMode.commentDesc}}</span>
      </a-form-item>
    </div>
<!--    按钮-->
    <a-form-item
    :style="{textAlign: 'center'}"
    >
      <a-button type="primary" :loading="loading" :disabled="loading" @click="closeOrder"
                v-if="init.orderType === 'Dispatch' && init.orderStatus < 5"
      >{{$t('orderDetail.closeOrder')}}</a-button>
      <a-button type="primary" :loading="loading" :disabled="loading" @click="closeOrder"
                v-if="init.orderType === 'Charge' && init.orderStatus === 0"
      >{{$t('orderDetail.closeOrder')}}</a-button>
    </a-form-item>
    <a-modal
      :title="$t('orderDetail.reasonTit')"
      :okText="$t('audit.submit')"
      :cancelText="$t('audit.cancel')"
      v-model="reasonVis"
      @ok="refuseSub"
      :okButtonProps="{props: {disabled: btnDisabled, loading: btnDisabled}}"
      @cancel="cancelClose"
      :destroyOnClose="true"
    >
      <a-textarea :placeholder="$t('orderDetail.tips')" autosize v-model="reason"/>
    </a-modal>
  </div>
</template>

<script>
import cList from '@/config/countryList'
import {postToken} from '@/config/extendAXIOS'
import urls from '@/config/api'

export default {
  name: 'detail',
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
    const typeList = [{value: this.$i18n.t('orderList.Dispatch'), key: 'Dispatch'},
      {value: this.$i18n.t('orderList.Charge'), key: 'Charge'}
    ]
    const statusList = {
      'Dispatch': [{value: this.$i18n.t('orderList.dispatch1'), key: 1}, {value: this.$i18n.t('orderList.dispatch2'), key: 2},
        {value: this.$i18n.t('orderList.dispatch3'), key: 3},
        {value: this.$i18n.t('orderList.dispatch4'), key: 4},
        {value: this.$i18n.t('orderList.dispatch5'), key: 5},
        {value: this.$i18n.t('orderList.dispatch6'), key: 6},
        {value: this.$i18n.t('orderList.dispatch7'), key: 7},
        {value: this.$i18n.t('orderList.dispatch8'), key: 8},
        {value: this.$i18n.t('orderList.dispatch9'), key: 9}
      ],
      'Charge': [{value: this.$i18n.t('orderList.charge0'), key: 0},
        {value: this.$i18n.t('orderList.charge1'), key: 1},
        {value: this.$i18n.t('orderList.charge2'), key: 2},
        {value: this.$i18n.t('orderList.charge3'), key: 3}]
    }
    return {
      typeList,
      statusList,
      cList,
      btnDisabled: false,
      countryList: cList2(),
      lang: lang,
      loading: false,
      reasonVis: false,
      reason: '',
      orderMode: {
        orderId: '',
        countryName: '',
        startAddress: '',
        endAddress: '',
        orderStatus: '',
        orderPrice: '',
        pmobileArea: '',
        pmobileNumber: '',
        dmobileArea: '',
        dmobileNumber: '',
        distance: '',
        completeDuration: '',
        createTime: '',
        endTime: '',
        arriveTime: '',
        boardingTime: '',
        callTime: '',
        orderType: '',
        vehicleNumber: ''
      },
      showRate: false,
      rateMode: {
        commentDesc: '',
        driverStar: 0,
        speedStar: 0,
        carStar: 0
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    }
  },
  created () {
  },
  props: ['init'],
  mounted () {
    let vm = this
    for (let k in vm.init) {
      if (vm.orderMode.hasOwnProperty(k)) {
        vm.orderMode[k] = vm.init[k]
      }
    }
    // getComplaintByOrderId
    let params = {
      orderId: vm.init.orderId
    }
    postToken(urls.getComplaintByOrderId, params).then(res => {
      let code = res.data.code
      let rate = res.data.data
      if (code === '10000') {
        for (let k in rate) {
          if (vm.rateMode.hasOwnProperty(k)) {
            vm.rateMode[k] = rate[k]
            vm.showRate = true
          }
        }
      } else {
        vm.$message.error(vm.$i18n.t('orderDetail.getRateFalse'))
      }
    }).catch(() => {
      vm.$message.error(vm.$i18n.t('orderDetail.getRateFalse'))
    })
  },
  methods: {
    toPage (url, info, tel) {
      let vm = this
      let userCountry = sessionStorage.getItem('countryCode')
      let telCountry = vm.cList.find(item => item.code === Number(tel)).locale
      if (userCountry === telCountry || !userCountry) {
        this.$router.push({path: url, query: {option: info}})
      } else if (userCountry && userCountry !== telCountry) {
        vm.$message.info('No Access')
      }
    },
    closeOrder () {
      this.loading = true
      this.reasonVis = true
    },
    cancelClose () {
      this.loading = false
      this.reasonVis = false
    },
    refuseSub () {
      let vm = this
      if (vm.reason === '') {
        vm.$message.error(vm.$i18n.t('orderDetail.reasonIsNull'))
        return false
      }
      let params = {
        orderId: vm.orderMode.orderId,
        closeReason: vm.reason,
        orderType: vm.orderMode.orderType
      }
      vm.btnDisabled = true
      postToken(urls.closeOrder, params).then(res => {
        let code = res.data.code
        if (code === '10000') {
          vm.$message.success(vm.$i18n.t('orderDetail.closeSuc'))
          vm.loading = false
          vm.reasonVis = false
          if (vm.orderMode.orderType === 'Dispatch') {
            vm.orderMode.orderStatus = 9
          } else if (vm.orderMode.orderType === 'Charge') {
            vm.orderMode.orderStatus = 3
          }
          setTimeout(_ => {
            vm.$emit('turnStatus', vm.orderMode)
          }, 1500)
          vm.btnDisabled = false
        } else {
          vm.$message.error(vm.$i18n.t('orderDetail.closeError'))
          vm.btnDisabled = false
        }
      }).catch(() => {
        vm.$message.error(vm.$i18n.t('orderDetail.closeError'))
        vm.btnDisabled = false
      })
    }
  }
}
</script>

<style scoped>
  h3{
    background: #e7e7e7;
  }
</style>
