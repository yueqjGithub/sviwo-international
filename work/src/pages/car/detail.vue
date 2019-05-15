<template>
  <div>
    <a-form>
      <a-form-item
        :label="$t('carList.countryName')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-select
          v-model="options.countryName"
          :disabled="doEdit"
          :filterOption="filterCountrySelect"
          showSearch
        >
          <a-select-option v-for="i in countryList" :key="i.en" v-if="lang === 'CN'">{{i.zh}}</a-select-option>
          <a-select-option v-for="i in countryList" :key="i.en" v-if="lang === 'EN'">{{i.en}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('carList.vehicleNumber')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.vehicleNumber" :disabled="doEdit"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('carList.licensePlates')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-input v-model.trim="options.licensePlates" :disabled="doEdit"></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('carList.carStatus')"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        v-if="doEdit"
      >
        <span v-if="options.carStatus === 0">{{$t('carList.undistributed')}}</span>
        <span v-if="options.carStatus === 1">{{$t('carList.allocated')}}</span>
        <span v-if="options.carStatus === 2">{{$t('carList.offline')}}</span>
      </a-form-item>
      <a-form-item
        :label="$t('carList.frontPhoto')"
        :label-col="{span:8}"
        :wrapper-col="{span: 12}"
        :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
      >
        <div v-if="doEdit">
          <img :src="ImgList1[0].url" alt=""  @click="handlePreview(ImgList1[0])" v-if="init.vehiclePhoto !== ''">
        </div>
        <div v-if="!doEdit">
          <a-upload
            v-if="!doEdit"
            name="file"
            listType="picture-card"
            class="avatar-uploader"
            :action="uploadUrl"
            :file-list="ImgList1"
            :headers="{token: token, lang: lang}"
            :withCredentials="true"
            @preview="handlePreview"
            @change="handleChange1"
          >
            <div v-if="ImgList1.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </div>
      </a-form-item>
      <a-form-item
        :label="$t('carList.leftPhoto')"
        :label-col="{span:8}"
        :wrapper-col="{span: 12}"
        :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
      >
        <div v-if="doEdit">
          <img :src="ImgList2[0].url" alt=""  @click="handlePreview(ImgList2[0])" v-if="init.vehiclePhoto !== ''">
        </div>
        <div v-if="!doEdit">
          <a-upload
            v-if="!doEdit"
            name="file"
            listType="picture-card"
            class="avatar-uploader"
            :action="uploadUrl"
            :file-list="ImgList2"
            :headers="{token: token, lang: lang}"
            :withCredentials="true"
            @preview="handlePreview"
            @change="handleChange2"
          >
            <div v-if="ImgList2.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </div>
      </a-form-item>
      <a-form-item
        :label="$t('carList.rearPhoto')"
        :label-col="{span:8}"
        :wrapper-col="{span: 12}"
        :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
      >
        <div v-if="doEdit">
          <img :src="ImgList3[0].url" alt=""  @click="handlePreview(ImgList3[0])" v-if="init.vehiclePhoto !== ''">
        </div>
        <div v-if="!doEdit">
          <a-upload
            v-if="!doEdit"
            name="file"
            listType="picture-card"
            class="avatar-uploader"
            :action="uploadUrl"
            :file-list="ImgList3"
            :headers="{token: token, lang: lang}"
            :withCredentials="true"
            @preview="handlePreview"
            @change="handleChange3"
          >
            <div v-if="ImgList3.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </div>
      </a-form-item>
      <a-form-item
        :label="$t('carList.rightPhoto')"
        :label-col="{span:8}"
        :wrapper-col="{span: 12}"
        :style="{display: 'inline-block', width: 'calc(50% - 4px)'}"
      >
        <div v-if="doEdit">
          <img :src="ImgList4[0].url" alt=""  @click="handlePreview(ImgList4[0])" v-if="init.vehiclePhoto !== ''">
        </div>
        <div v-if="!doEdit">
          <a-upload
            v-if="!doEdit"
            name="file"
            listType="picture-card"
            class="avatar-uploader"
            :action="uploadUrl"
            :file-list="ImgList4"
            :headers="{token: token, lang: lang}"
            :withCredentials="true"
            @preview="handlePreview"
            @change="handleChange4"
          >
            <div v-if="ImgList4.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </div>
      </a-form-item>
    </a-form>
    <div class="buttonList">
      <a-button type="primary" v-if="showSubmit" @click="editDriver" :loading="isLoading" :disabled="isLoading">{{$t('addCountry.submit')}}</a-button>
      <a-button type="primary" @click="toEdit" v-if="view === 2 && !showSubmit">{{$t('addCountry.edit')}}</a-button>
    </div>
  </div>
</template>

<script>
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
      isLoading: false,
      // 显示保存按钮
      showSubmit: true,
      // 车辆组
      carList: [],
      // 图片组
      ImgList1: [],
      ImgList2: [],
      ImgList3: [],
      ImgList4: [],
      // 图片组
      countryList: cList2(),
      lang: lang,
      token: token,
      loading: false,
      doEdit: false, // 修改
      detail: false, // 查看详情
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      // ------
      imgHost: urls.imgHost,
      uploadUrl: urls.uploadImage,
      options: {
        carId: '',
        vehicleNumber: '',
        vehiclePhoto: '',
        carStatus: '',
        licensePlates: '',
        countryName: '',
        countryCode: ''
      }
    }
  },
  mounted () {
    let vm = this
    if (vm.view === 2) { // 场景为查看详情
      vm.doEdit = true
      vm.detail = true
      vm.showSubmit = false
      for (let k in vm.init) {
        if (vm.options.hasOwnProperty(k)) {
          vm.options[k] = vm.init[k]
        }
      }
      if (vm.options.vehiclePhoto) { // init头像
        console.log('in')
        let arr = vm.options.vehiclePhoto.split(',')
        vm.ImgList1.push({
          uid: -1,
          name: 'img1',
          status: 'done',
          url: vm.imgHost + arr[0]
        })
        vm.ImgList2.push({
          uid: -2,
          name: 'img2',
          status: 'done',
          url: vm.imgHost + arr[1]
        })
        vm.ImgList3.push({
          uid: -3,
          name: 'img3',
          status: 'done',
          url: vm.imgHost + arr[2]
        })
        vm.ImgList4.push({
          uid: -4,
          name: 'img4',
          status: 'done',
          url: vm.imgHost + arr[3]
        })
      }
    }
  },
  methods: {
    // preview
    handlePreview (file) {
      let url = file.url || file.thumbUrl
      this.preView(url)
    },
    handleChange1 (file) { // 更改头像
      let vm = this
      if (file.file.status === 'error') {
        vm.$message.error(vm.$i18n.t('common.false'))
        return false
      }
      this.ImgList1 = file.fileList
    },
    handleChange2 (file) { // 更改头像
      let vm = this
      if (file.file.status === 'error') {
        vm.$message.error(vm.$i18n.t('common.false'))
        return false
      }
      this.ImgList2 = file.fileList
    },
    handleChange3 (file) { // 更改头像
      let vm = this
      if (file.file.status === 'error') {
        vm.$message.error(vm.$i18n.t('common.false'))
        return false
      }
      this.ImgList3 = file.fileList
    },
    handleChange4 (file) { // 更改头像
      let vm = this
      if (file.file.status === 'error') {
        vm.$message.error(vm.$i18n.t('common.false'))
        return false
      }
      this.ImgList4 = file.fileList
    },
    // 修改
    toEdit () {
      this.showSubmit = true
      this.doEdit = false
      // this.driver.headImage = ''
      // this.driver.driverLicenseImage = ''
    },
    // 提交
    editDriver () {
      if (this.view === 1) {
        this.addSubmit()
      } else if (this.view === 2) {
        this.editSubmit()
      }
    },
    addSubmit () {
      let vm = this
      let UrlList = []
      if (vm.ImgList1.length > 0) {
        UrlList.push(vm.ImgList1[0].url ? vm.init.vehiclePhoto.split(',')[0].url : vm.ImgList1[0].response.data.url)
      }
      if (vm.ImgList2.length > 0) {
        UrlList.push(vm.ImgList2[0].url ? vm.init.vehiclePhoto.split(',')[1].url : vm.ImgList2[0].response.data.url)
      }
      if (vm.ImgList3.length > 0) {
        UrlList.push(vm.ImgList3[0].url ? vm.init.vehiclePhoto.split(',')[2].url : vm.ImgList3[0].response.data.url)
      }
      if (vm.ImgList4.length > 0) {
        UrlList.push(vm.ImgList4[0].url ? vm.init.vehiclePhoto.split(',')[3].url : vm.ImgList4[0].response.data.url)
      }
      let addOpt = {
        vehicleNumber: vm.options.vehicleNumber,
        countryCode: vm.countryList.find(item => item.en === vm.options.countryName).locale || '',
        vehiclePhoto: UrlList.length > 3 ? UrlList.join(',') : '',
        countryName: vm.options.countryName,
        licensePlates: vm.options.licensePlates
      }
      for (let k in addOpt) {
        if (addOpt[k] === '') {
          vm.$message.error(vm.$i18n.t('addDriver.optionNotFull'))
          return false
        }
      }
      vm.isLoading = true
      postToken(urls.saveOrUpdateCar, addOpt).then(res => {
        let code = res.data.code
        if (code === '10000') {
          vm.$message.success(vm.$i18n.t('common.success'))
          setTimeout(() => {
            vm.$router.go(0)
          }, 1500)
        } else {
          vm.$message.error(vm.$i18n.t('common.false'))
        }
        vm.isLoading = false
      }).catch(() => {
        vm.$message.error(vm.$i18n.t('common.false'))
        vm.isLoading = false
      })
    },
    editSubmit () {
      let vm = this
      let UrlList = []
      if (vm.ImgList1.length > 0) {
        UrlList.push(vm.ImgList1[0].url ? vm.init.vehiclePhoto.split(',')[0] : vm.ImgList1[0].response.data.url)
      }
      if (vm.ImgList2.length > 0) {
        UrlList.push(vm.ImgList2[0].url ? vm.init.vehiclePhoto.split(',')[1] : vm.ImgList2[0].response.data.url)
      }
      if (vm.ImgList3.length > 0) {
        UrlList.push(vm.ImgList3[0].url ? vm.init.vehiclePhoto.split(',')[2] : vm.ImgList3[0].response.data.url)
      }
      if (vm.ImgList4.length > 0) {
        UrlList.push(vm.ImgList4[0].url ? vm.init.vehiclePhoto.split(',')[3] : vm.ImgList4[0].response.data.url)
      }
      let addOpt = {
        carId: vm.options.carId,
        vehicleNumber: vm.options.vehicleNumber,
        countryCode: vm.countryList.find(item => item.en === vm.options.countryName).locale,
        vehiclePhoto: UrlList.length > 3 ? UrlList.join(',') : '',
        countryName: vm.options.countryName,
        licensePlates: vm.options.licensePlates
      }
      vm.isLoading = true
      postToken(urls.saveOrUpdateCar, addOpt).then(res => {
        let code = res.data.code
        if (code === '10000') {
          vm.$message.success(vm.$i18n.t('common.success'))
          setTimeout(() => {
            vm.$router.go(0)
          }, 1500)
        } else {
          vm.$message.error(vm.$i18n.t('common.false'))
        }
        vm.isLoading = false
      }).catch(() => {
        vm.$message.error(vm.$i18n.t('common.false'))
        vm.isLoading = false
      })
    }
  }
}
</script>

<style scoped>
  .buttonList{
    text-align: center;
  }
  img{
    max-width: 100%;
    max-height: 180px;
  }
</style>
