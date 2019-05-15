<template>
  <div>
    <a-form>
      <h3>{{$t('addDriver.Basic')}}</h3>
      <div class="contMode">
        <a-form-item :style="{display: 'inline-block',width: '20%'}">
<!--          <a-avatar :src="hImgList[0].url" v-if="doEdit" :size="160" icon="user"/>-->
          <a-upload
            name="file"
            listType="picture-card"
            class="avatar-uploader"
            :action="uploadUrl"
            :file-list="hImgList"
            :headers="{token: token, lang: lang}"
            :withCredentials="true"
            @preview="handlePreview"
            @change="handleChange"
          >
            <div v-if="hImgList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item :style="{display: 'inline-block',width: '74%'}">
          <a-form-item
            :label="$t('driverList.drivingCountry')"
            :label-col="{span: 8}"
            :wrapper-col="wrapperCol"
            :style="{display: 'inline-block', width: '50%'}"
          >
            <a-select
              v-model="driver.drivingCountry"
              :filterOption="filterCountrySelect"
              showSearch
            >
              <a-select-option v-for="i in countryList" :key="i.locale" v-if="lang === 'CN'">{{i.zh}}</a-select-option>
              <a-select-option v-for="i in countryList" :key="i.locale" v-if="lang === 'EN'">{{i.en}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            :label="$t('driverList.telCountry')"
            :label-col="{span: 8}"
            :wrapper-col="wrapperCol"
            :style="{display: 'inline-block', width: '50%'}"
          >
            <a-select
              v-model="driver.telCountry"
              :disabled="true"
            >
              <a-select-option v-for="i in countryList" :key="i.en" v-if="lang === 'CN'">{{i.zh}}</a-select-option>
              <a-select-option v-for="i in countryList" :key="i.en" v-if="lang === 'EN'">{{i.en}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            :label="$t('driverList.lastName')"
            :label-col="{span: 8}"
            :wrapper-col="wrapperCol"
            :style="{display: 'inline-block', width: '50%'}"
          >
            <a-input v-model.trim="driver.lastName"></a-input>
          </a-form-item>
          <a-form-item
            :label="$t('driverList.firstName')"
            :label-col="{span: 8}"
            :wrapper-col="wrapperCol"
            :style="{display: 'inline-block', width: '50%'}"
          >
            <a-input v-model.trim="driver.firstName"></a-input>
          </a-form-item>
          <a-form-item
            :label="$t('driverList.mobileNumber')"
            :label-col="{span: 8}"
            :wrapper-col="wrapperCol"
            :style="{display: 'inline-block', width: '50%'}"
          >
            <a-input v-model.trim="driver.mobileNumber" :disabled="true"></a-input>
          </a-form-item>
          <a-form-item
            :label="$t('driverList.driverBirthday')"
            :label-col="{span: 8}"
            :wrapper-col="wrapperCol"
            :style="{display: 'inline-block', width: '50%'}"
          >
            <el-date-picker
              v-model="driver.driverBirthday"
              type="date"
            >
            </el-date-picker>
          </a-form-item>
          <a-form-item
            :label="$t('driverList.driverSex')"
            :label-col="{span: 8}"
            :wrapper-col="wrapperCol"
            :style="{display: 'inline-block', width: '50%'}"
          >
            <a-select
              v-model="driver.driverSex"
            >
              <a-select-option :key="0">female</a-select-option>
              <a-select-option :key="1">male</a-select-option>
            </a-select>
          </a-form-item>
        </a-form-item>
      </div>
      <h3>{{$t('addDriver.identity')}}</h3>
      <div class="contMode">
        <a-form-item
          :label="$t('driverList.certificateNo')"
          :label-col="{span:4}"
          :wrapper-col="{span: 6}"
        >
          <a-input v-model.trim="driver.certificateNo"></a-input>
        </a-form-item>
        <a-form-item
          :label="$t('driverList.certificateImage')"
          :label-col="{span:4}"
          :wrapper-col="{span: 20}"
        >
          <div class="hideInput">
            <a-upload
              :action="uploadUrl"
              listType="picture-card"
              :fileList="cImgList"
              @preview="handlePreview"
              @change="handleChange2"
            >
              <div v-if="cImgList.length < 2">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </div>
        </a-form-item>
      </div>
      <h3>{{$t('addDriver.driverInfo')}}</h3>
      <div class="contMode">
        <a-form-item
          :label="$t('driverList.driverLicenseTimeStart')"
          :label-col="{span:8}"
          :wrapper-col="{span: 12}"
          :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
        >
          <el-date-picker
            v-model="driver.driverLicenseTimeStart"
            type="datetime"
          >
          </el-date-picker>
<!--          <a-input v-model.trim="driver.driverLicenseTimeStart" :disabled="true" v-if="doEdit"></a-input>-->
        </a-form-item>
        <a-form-item
          :label="$t('driverList.driverLicenseTimeEnd')"
          :label-col="{span:8}"
          :wrapper-col="{span: 12}"
          :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
        >
          <el-date-picker
            v-model="driver.driverLicenseTimeEnd"
            type="datetime"
          >
          </el-date-picker>
<!--          <a-input v-model.trim="driver.driverLicenseTimeEnd" :disabled="true" v-if="doEdit"></a-input>-->
        </a-form-item>
        <a-form-item
          :label="$t('driverList.driverLicenseImage')"
          :label-col="{span:4}"
          :wrapper-col="{span: 20}"
        >
          <div>
            <a-upload
              name="file"
              listType="picture-card"
              class="avatar-uploader"
              :action="uploadUrl"
              :file-list="lImgList"
              :headers="{token: token, lang: lang}"
              :withCredentials="true"
              @preview="handlePreview"
              @change="handleChange3"
            >
              <div v-if="lImgList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </div>
        </a-form-item>
      </div>
      <h3>{{$t('addDriver.distribution')}}</h3>
      <div class="contMode">
        <a-form-item
          :label="$t('carList.vehicleNumber')"
          :label-col="{span:8}"
          :wrapper-col="{span: 12}"
          :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
        >
          <a-select
            v-model="driver.vehicleNumber"
          >
            <a-select-option v-for="i in carList" :key="i.vehicleNumber">{{i.vehicleNumber}}</a-select-option>
          </a-select>
        </a-form-item>
      </div>
    </a-form>
    <div class="buttonList">
      <a-button type="primary" @click="editDriver">{{$t('driverList.pass')}}</a-button>
      <a-button @click="refuseDriver">{{$t('driverList.refuse')}}</a-button>
    </div>
    <a-modal
      :title="$t('audit.refuseTit')"
      :okText="$t('audit.submit')"
      :cancelText="$t('audit.cancel')"
      v-model="reasonVis"
      @ok="refuseSub"
      :destroyOnClose="true"
    >
      <a-select mode="multiple" style="width: 100%;" @change="selectReason" :showArrow="true">
        <a-select-option :value="$t('audit.reason1')">{{$t('audit.reason1')}}</a-select-option>
        <a-select-option :value="$t('audit.reason2')">{{$t('audit.reason2')}}</a-select-option>
        <a-select-option :value="$t('audit.reason3')">{{$t('audit.reason3')}}</a-select-option>
        <a-select-option :value="$t('audit.reason4')">{{$t('audit.reason4')}}</a-select-option>
      </a-select>
    </a-modal>
  </div>
</template>

<script>
// eslint-disable-next-line
import moment from 'moment'
import { postToken } from '@/config/extendAXIOS'
import urls from '@/config/api'
import cList from '@/config/countryList'
export default {
  name: 'Detail',
  props: ['init', 'view'],
  data () {
    const token = sessionStorage.getItem('token')
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
      // 弹出拒绝原因
      reasonVis: false,
      // 拒绝原因
      refuseReason: '',
      // 显示保存按钮
      showSubmit: true,
      // 车辆组
      carList: [],
      // 图片组
      hImgList: [],
      cImgList: [],
      lImgList: [],
      // 图片组
      countryList: cList2(),
      lang: lang,
      token: token,
      loading: false,
      doEdit: false, // 修改
      detail: false, // 查看详情
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      },
      // ------
      imgHost: urls.imgHost,
      uploadUrl: urls.uploadImage,
      driver: {
        driverId: '',
        carId: '',
        firstName: '',
        lastName: '',
        mobileNumber: '',
        headImage: '',
        countryCode: '',
        telCountry: '',
        driverStatus: '',
        driverSex: '',
        driverBirthday: '',
        loginTime: '',
        createTime: '',
        certificateNo: '',
        certificateImage: '',
        driverLicenseTimeStart: '',
        driverLicenseTimeEnd: '',
        driverLicenseImage: '',
        vehicleNumber: '',
        licensePlates: '',
        drivingCountry: '',
        registerOrigin: ''
      }
    }
  },
  created () {
    let vm = this
    let params = {
      pageSize: 100,
      currentPage: 1,
      carStatus: 0,
      countryCode: sessionStorage.getItem('countryCode'),
      status: 0
    }
    postToken(urls.getCarList, params).then(res => {
      let code = res.data.code
      let response = res.data.data
      if (code === '10000') {
        vm.carList = response.data
      } else {
        vm.$message.error(vm.$i18n.t('common.getDataFalse'))
      }
    }).catch(() => {
      vm.$message.error(vm.$i18n.t('common.getDataError'))
    })
  },
  mounted () {
    let vm = this
    if (vm.view === 2) { // 场景为查看详情
      vm.doEdit = true
      vm.detail = true
      vm.showSubmit = false
      for (let k in vm.init) {
        if (vm.driver.hasOwnProperty(k)) {
          vm.driver[k] = vm.init[k]
        }
      }
      if (vm.driver.drivingCountry === '') {
        vm.driver.drivingCountry = vm.driver.telCountry
      }
      if (vm.driver.driverBirthday) {
        vm.driver.driverLicenseTimeStart = moment(vm.driver.driverLicenseTimeStart)._i
      }
      if (vm.driver.driverLicenseTimeStart) {
        vm.driver.driverLicenseTimeStart = moment(vm.driver.driverLicenseTimeStart)._i
      }
      if (vm.driver.driverLicenseTimeEnd) {
        vm.driver.driverLicenseTimeEnd = moment(vm.driver.driverLicenseTimeEnd)._i
      }
      if (vm.driver.driverLicenseImage) { // init驾驶证
        vm.lImgList.push({
          uid: Math.random() * -100,
          name: 'LImg',
          status: 'done',
          url: vm.imgHost + vm.driver.driverLicenseImage
        })
      }
      if (vm.driver.headImage) { // init头像
        vm.hImgList.push({
          uid: Math.random() * -10,
          name: 'hImg',
          status: 'done',
          url: vm.imgHost + vm.driver.headImage
        })
      }
      if (vm.driver.certificateImage) {
        let list = vm.driver.certificateImage.split(',')
        let arr = []
        for (let k in list) {
          let item = {
            uid: Math.random() * -1,
            name: k.toString(),
            status: 'done',
            url: vm.imgHost + list[k]
          }
          arr.push(item)
        }
        vm.cImgList = arr
      }
    }
  },
  methods: {
    moment,
    // preview
    handlePreview (file) {
      let url = file.url || file.thumbUrl
      this.preView(url)
    },
    // 修改
    toEdit () {
      let vm = this
      this.showSubmit = true
      this.doEdit = false
      this.driver.headImage = ''
      this.driver.driverLicenseImage = ''
      if (vm.carList < 1) {
        vm.$message.info(vm.$i18n.t('carList.noCar'))
      }
    },
    handleChange (file) { // 更改头像
      let vm = this
      if (file.file.status === 'error') {
        vm.$message.error(vm.$i18n.t('common.false'))
        return false
      }
      this.hImgList = file.fileList
    },
    // 驾驶证照片
    handleChange3 (file) {
      let vm = this
      if (file.file.status === 'error') {
        vm.$message.error(vm.$i18n.t('common.false'))
        return false
      }
      this.lImgList = file.fileList
    },
    // 证件照片
    handleChange2 (file) {
      let vm = this
      if (file.file.status === 'error') {
        vm.$message.error(vm.$i18n.t('common.false'))
        return false
      }
      this.cImgList = file.fileList
    },
    birthChange (data, dataString) {
      this.driver.driverBirthday = new Date(dataString).getTime()
    },
    // 取消
    cancelSub () {
    },
    // 提交
    editDriver () {
      if (this.view === 1) {
        this.addSubmit()
      } else if (this.view === 2) {
        this.editSubmit()
      }
    },
    editSubmit () {
      let vm = this
      // console.log(vm.init)
      let cUrlList = []
      if (vm.cImgList.length > 1) {
        // vm.cImgList.forEach(item => {
        //   cUrlList.push(item.url)
        // })
        for (let k in vm.cImgList) {
          // console.log(k)
          cUrlList.push(vm.cImgList[k].url ? vm.init.certificateImage.split(',')[k] : vm.cImgList[k].response.data.url)
        }
      }
      let hUrlList = ''
      if (vm.hImgList.length > 0) {
        hUrlList = vm.hImgList[0].url ? vm.init.headImage : vm.hImgList[0].response.data.url
      }
      let lUrlList = ''
      if (vm.lImgList.length > 0) {
        lUrlList = vm.lImgList[0].url ? vm.init.driverLicenseImage : vm.lImgList[0].response.data.url
      }
      if (vm.driver.vehicleNumber === '') {
        vm.$message.error(vm.$i18n.t('addDriver.optionNotFull'))
        return false
      }
      // let carId = vm.init.carId
      // if (vm.carList.find(item => item.vehicleNumber === vm.driver.vehicleNumber).carId) {
      //   carId = vm.carList.find(item => item.vehicleNumber === vm.driver.vehicleNumber).carId
      // }
      let carId = ''
      if (vm.driver.vehicleNumber !== vm.init.vehicleNumber) {
        carId = vm.carList.find(item => item.vehicleNumber === vm.driver.vehicleNumber).carId
      } else if (vm.driver.vehicleNumber === vm.init.vehicleNumber) {
        carId = vm.init.carId
      }
      let opt = {
        driverId: vm.init.driverId,
        carId: carId,
        firstName: vm.driver.firstName,
        lastName: vm.driver.lastName,
        driverStatus: 2,
        driverSex: vm.driver.driverSex,
        driverBirthday: vm.driver.driverBirthday === '' ? '' : vm.eleTimeExchange(vm.driver.driverBirthday),
        drivingCountry: vm.driver.drivingCountry,
        certificateNo: vm.driver.certificateNo,
        driverLicenseTimeStart: vm.driver.driverLicenseTimeStart === '' ? '' : vm.eleTimeExchange(vm.driver.driverLicenseTimeStart),
        driverLicenseTimeEnd: vm.driver.driverLicenseTimeEnd === '' ? '' : vm.eleTimeExchange(vm.driver.driverLicenseTimeEnd),
        certificateImage: cUrlList.length > 1 ? cUrlList.join(',') : '',
        headImage: vm.hImgList.length > 0 ? hUrlList : '',
        driverLicenseImage: vm.lImgList.length > 0 ? lUrlList : '',
        registerOrigin: vm.driver.registerOrigin
      }
      let cerNoRe = /^[0-9a-zA-Z]+$/
      if (!cerNoRe.test(opt.certificateNo.toString())) {
        vm.$message.error(vm.$i18n.t('addDriver.certificateNoError'))
        return false
      } else {
        if (opt.certificateNo.length < 5) {
          vm.$message.error(vm.$i18n.t('addDriver.certificateNoError'))
          return false
        }
      }
      for (let k in opt) {
        if (opt[k] === '') {
          vm.$message.error(vm.$i18n.t('addDriver.optionNotFull'))
          return false
        }
      }
      this.$confirm({
        title: vm.$i18n.t('common.warning'),
        content: vm.$i18n.t('audit.toastInfo'),
        okText: vm.$i18n.t('common.ok'),
        cancelText: vm.$i18n.t('common.cancel'),
        onOk () {
          postToken(urls.examineDriver, opt).then(res => {
            let code = res.data.code
            if (code === '10000') {
              vm.$message.success(vm.$i18n.t('audit.auditSuc'))
              setTimeout(() => {
                vm.$router.go(0)
              }, 1500)
            } else {
              vm.$message.error(vm.$i18n.t('audit.auditError'))
            }
          }).catch(() => {
            vm.$message.error(vm.$i18n.t('audit.auditError'))
          })
        },
        onCancel () {}
      })
    },
    refuseDriver () {
      this.reasonVis = true
    },
    selectReason (value) {
      this.refuseReason = value
    },
    refuseSub () {
      let vm = this
      if (this.refuseReason.length < 1) {
        vm.$message.error(vm.$i18n.t('audit.refuseError'))
        return false
      }
      let params = {
        driverId: vm.init.driverId,
        driverStatus: 3,
        remark: vm.refuseReason.join(','),
        registerOrigin: vm.driver.registerOrigin,
        driverSex: vm.driver.driverSex,
        driverBirthday: vm.driver.driverBirthday === '' ? '' : vm.eleTimeExchange(vm.driver.driverBirthday)
      }
      postToken(urls.examineDriver, params).then(res => {
        let code = res.data.code
        if (code === '10000') {
          vm.$message.info(vm.$i18n.t('audit.auditFalse'))
          setTimeout(() => {
            vm.$router.go(0)
          }, 1500)
        } else {
          vm.$message.error(vm.$i18n.t('audit.auditError'))
        }
      }).catch(() => {
        vm.$message.error(vm.$i18n.t('audit.auditError'))
      })
    }
  },
  computed: {
  }
}
</script>

<style scoped>
  h3{
    background: #e7e7e7;
  }
  .contMode {
    padding: 8px;
    width: 100%;
  }
  .cImgGroup{
    display: flex;
    justify-content: space-between;
    max-height: 40vh;
    overflow-y: hidden;
  }
  .cImgShow{
    width: 45%;
  }
  .buttonList{
    text-align: center;
  }
</style>
