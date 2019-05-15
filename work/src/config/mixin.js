// import urls from '@/config/api.js'
const myMix = {
  // element GMT转时间戳
  methods: {
    // 国家下拉框过滤
    filterCountrySelect (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    eleTimeExchange: function (time) {
      let data1 = new Date(time).getTime()
      return data1
    },
    // 放大图片查看
    preView: function (url) {
      let src = url
      this.$store.commit('admin/seePic', src)
    }
  }
}

export default myMix
